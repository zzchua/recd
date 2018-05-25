import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, TouchableOpacity, Image, Platform } from 'react-native';
import { ImagePicker } from 'expo';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { SignupInput } from '../components/common';

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
    };
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.onSubmitSecondaryDetails = this.onSubmitSecondaryDetails.bind(this);
    this.pickProfilePic = this.pickProfilePic.bind(this);
  }

  renderErrorMessage() {
    return null;
  }

  onSubmitSecondaryDetails() {
    return null;
  }

  async pickProfilePic() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
    });
    if (!result.cancelled) {
      this.setState({ photoURL: result.uri });
    }
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
            errorMessage={this.renderErrorMessage()}
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
            errorMessage={this.renderErrorMessage()}
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
            onPress={this.onSubmitSecondaryDetails}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    email: state.auth.email,
    displayName: state.auth.displayName,
    photoURL: state.auth.photoURL,
  };
};

SecondaryDetailsScreen.propTypes = {
  email: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  photoURL: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape().isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(SecondaryDetailsScreen);
