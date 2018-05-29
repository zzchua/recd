import React, { Component } from 'react';
import { View, StyleSheet, Button,
  Text, TouchableOpacity, Image,
  Platform, ActivityIndicator, Alert,
} from 'react-native';
import { ImagePicker } from 'expo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SignupInput } from '../components/common';
import { getUserByUsername, getUserByEmail } from '../database/DatabaseUtils';
import { MINIMUM_USERNAME_LENGTH } from '../constants';
import { updateFirebaseUserAndAddSecondaryDetails } from '../actions/AuthActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: (Platform.OS === 'ios') ? 20 : 0,
  },
  formContainer: {
    backgroundColor: 'gray',
    width: 400,
    borderRadius: 10,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: (150 / 2),
  },
  imageContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class SecondaryDetailsScreen extends Component {
  static getFirstNameLastNameFromDisplayName(displayName) {
    const parts = displayName.split(' ');
    const firstName = parts.slice(0, parts.length - 1).join(' ');
    let lastName = '';
    if (parts.length > 1) {
      lastName = parts[parts.length - 1];
    }
    return [firstName, lastName];
  }

  constructor(props) {
    super(props);
    const [firstName, lastName] =
      SecondaryDetailsScreen.getFirstNameLastNameFromDisplayName(props.displayName);
    this.state = {
      email: props.email,
      firstName,
      lastName,
      photoURL: props.photoURL,
      username: '',
      isEmailValid: true,
      isEmailUnique: true,
      isUsernameUnique: true,
      isUsernameLengthValid: true,
      isFirstNameValid: true,
      photoUpdated: false,
    };
    this.renderEmailErrorMessage = this.renderEmailErrorMessage.bind(this);
    this.renderUsernameErrorMessage = this.renderUsernameErrorMessage.bind(this);
    this.validateEmailAddressFormat = this.validateEmailAddressFormat.bind(this);
    this.validateEmailUnique = this.validateEmailUnique.bind(this);
    this.pickProfilePic = this.pickProfilePic.bind(this);
    this.onSubmitUpdateUserProfile = this.onSubmitUpdateUserProfile.bind(this);
    this.onQuitModal = this.onQuitModal.bind(this);
  }

  componentDidUpdate() {
    if (this.props.userProfileUpdated || this.props.updateUserProfileError) {
      this.renderConfirmationAlert();
    }
  }

  renderUsernameErrorMessage() {
    if (!this.state.isUsernameLengthValid) {
      return 'Username must be more than 5 characters';
    }
    if (!this.state.isUsernameUnique) {
      return 'This username is already taken';
    }
    return null;
  }

  renderEmailErrorMessage() {
    if (!this.state.isEmailValid) {
      return 'Please enter a valid email address';
    }
    if (!this.state.isEmailUnique) {
      return 'This email has already been registered';
    }
    return null;
  }

  renderConfirmationAlert() {
    const confirm =
      this.props.updateUserProfileError ?
        'There was an error completing your signup' : 'You are all set!';
    Alert.alert(
      confirm,
      '',
      [{ text: 'Ok', onPress: this.onQuitModal }],
      { cancelable: false },
    );
  }

  onQuitModal() {
    this.props.navigation.popToTop();
  }

  async onSubmitUpdateUserProfile() {
    let isEmailUnique = true;
    const isEmailValid = this.validateEmailAddressFormat();
    if (isEmailValid) {
      isEmailUnique = await this.validateEmailUnique();
    }

    let isUsernameUnique = true;
    const isUsernameLengthValid = this.validateUsernameLength(this.state.username);
    if (isUsernameLengthValid) {
      isUsernameUnique = await this.validateUniqueUsername();
    }

    const isFirstNameValid = this.state.firstName.trim().length > 0;
    if (!isFirstNameValid) { this.firstNameInput.shake(); }
    this.setState({ isFirstNameValid });

    if (isEmailUnique && isEmailValid &&
       isUsernameUnique && isUsernameLengthValid && isFirstNameValid) {
      const {
        username, firstName, lastName, photoUpdated, email,
      } = this.state;

      let { photoURL } = this.state;

      if (!photoUpdated) { photoURL = ''; }

      this.props.updateFirebaseUserAndAddSecondaryDetails(
        email, username,
        firstName, lastName, photoURL,
      );
    }
  }

  async pickProfilePic() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
    });
    if (!result.cancelled) {
      this.setState({ photoURL: result.uri, photoUpdated: true });
    }
  }

  validateEmailFormat(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.length > 0 && regex.test(String(email).toLowerCase());
  }

  validateEmailAddressFormat() {
    const { email } = this.state;
    const isEmailValid = this.validateEmailFormat(email);
    this.setState({ isEmailValid });
    if (!isEmailValid) {
      this.emailInput.shake();
    }
    return isEmailValid;
  }

  async validateEmailUnique() {
    const { email } = this.state;
    const querySnapshot = await getUserByEmail(email);
    const isEmailUnique = querySnapshot.size === 0;
    this.setState({ isEmailUnique });
    if (!isEmailUnique) {
      this.emailInput.shake();
    }
    return isEmailUnique;
  }

  validateUsernameLength() {
    const { username } = this.state;
    const isUsernameLengthValid = username.length > MINIMUM_USERNAME_LENGTH;
    this.setState({ isUsernameLengthValid });
    if (!isUsernameLengthValid) {
      this.usernameInput.shake();
    }
    return isUsernameLengthValid;
  }

  async validateUniqueUsername() {
    const { username } = this.state;
    const querySnapshot = await getUserByUsername(username);
    const isUsernameUnique = querySnapshot.size === 0;
    this.setState({ isUsernameUnique });
    if (!isUsernameUnique) {
      this.usernameInput.shake();
    }
    return isUsernameUnique;
  }

  renderLoading() {
    if (this.props.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return null;
  }

  renderErrorMessage() {
    if (this.state.updateUserProfileError) {
      return (
        <Text style={{ color: 'red' }}>Something went wrong... Please try again</Text>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text>We're almost done signing you up...</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={this.pickProfilePic}>
              <Image source={{ uri: this.state.photoURL }} style={styles.image} />
            </TouchableOpacity>
          </View>
          <SignupInput
            reference={(input) => { this.usernameInput = input; }}
            value={this.state.username}
            isPassword={false}
            label='Username'
            placeholder='Username'
            keyboardType='default'
            onChangeText={username => this.setState({ username: username.toLowerCase() })}
            errorMessage={this.renderUsernameErrorMessage()}
            returnKeyType='done'
          />
          <SignupInput
            value={this.state.email}
            reference={(input) => { this.emailInput = input; }}
            isPassword={false}
            label='Email'
            placeholder='Email'
            keyboardType='email-address'
            onChangeText={email => this.setState({ email })}
            errorMessage={this.renderEmailErrorMessage()}
            returnKeyType='next'
          />
          <SignupInput
            reference={(input) => { this.firstNameInput = input; }}
            value={this.state.firstName}
            isPassword={false}
            label='First Name'
            placeholder='First Name'
            keyboardType='default'
            onChangeText={firstName => this.setState({ firstName })}
            errorMessage={this.state.isFirstNameValid ? null : 'Please enter a valid first name'}
            returnKeyType='next'
          />
          <SignupInput
            value={this.state.lastName}
            isPassword={false}
            label='Last Name'
            placeholder='Last Name'
            keyboardType='default'
            onChangeText={lastName => this.setState({ lastName })}
            returnKeyType='done'
          />
        </View>
        <View>
          <Button
            title='Next'
            onPress={this.onSubmitUpdateUserProfile}
          />
        </View>
        {this.renderLoading()}
        {this.renderErrorMessage()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    email: state.auth.email,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
    userProfileUpdated: state.auth.userProfileUpdated,
    updateUserProfileError: state.auth.updateUserProfileError,
  };
};

const mapDispatchToProps = {
  updateFirebaseUserAndAddSecondaryDetails,
};

SecondaryDetailsScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  updateUserProfileError: PropTypes.bool.isRequired,
  userProfileUpdated: PropTypes.bool.isRequired,
  updateFirebaseUserAndAddSecondaryDetails: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape().isRequired,
    popToTop: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecondaryDetailsScreen);
