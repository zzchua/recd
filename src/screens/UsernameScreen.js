import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signUpUserWithEmail } from '../actions/AuthActions';
import { SignupInput } from '../components/common';
import { getUserByUsername } from '../database/DatabaseUtils';
import { MINIMUM_USERNAME_LENGTH } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'gray',
    width: 400,
    borderRadius: 10,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
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

class UsernameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.navigation.state.params.userInfo,
      username: '',
      isUsernameUnique: true,
      isUsernameLengthValid: true,
    };
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.signUpWithFirebase = this.signUpWithFirebase.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSignedUp) {
      this.props.navigation.navigate('App');
    }
  }

  async signUpWithFirebase() {
    const { userInfo } = this.state;
    try {
      // Check this first
      const isUsernameLengthValid = this.validateUsernameLength(this.state.username);
      if (!isUsernameLengthValid) {
        this.usernameInput.shake();
        this.setState({
          isUsernameLengthValid,
        });
        return;
      }

      const isUsernameUnique = await this.validateUniqueUsername(this.state.username);
      if (!isUsernameUnique) {
        this.usernameInput.shake();
        this.setState({
          isUsernameUnique,
        });
        return;
      }

      userInfo.username = this.state.username;
      this.props.signUpUserWithEmail(userInfo);
      this.setState({
        isUsernameUnique,
        isUsernameLengthValid,
      });
    } catch (error) {
      // TODO: Handle error
    }
  }

  validateUsernameLength(username) {
    return username.length > MINIMUM_USERNAME_LENGTH;
  }

  async validateUniqueUsername(username) {
    const querySnapshot = await getUserByUsername(username);
    return querySnapshot.size === 0;
  }

  renderErrorMessage() {
    if (!this.state.isUsernameLengthValid) {
      return 'Username must be more than 5 characters';
    }
    if (!this.state.isUsernameUnique) {
      return 'This username is already taken';
    }
    return null;
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

  render() {
    return (
      <View style={styles.container}>
        <Text>Choose a username</Text>

        <View style={styles.formContainer}>
          <SignupInput
            reference={(input) => { this.usernameInput = input; }}
            value={this.state.username}
            isPassword={false}
            placeholder='Username'
            keyboardType='default'
            onChangeText={username => this.setState({ username: username.toLowerCase() })}
            errorMessage={this.renderErrorMessage()}
            returnKeyType='done'
          />
        </View>
        <Button
          title='Finish'
          onPress={this.signUpWithFirebase}
        />
        {this.renderLoading()}
      </View>
    );
  }
}

// TODO: import error state
const mapStateToProps = (state) => {
  return {
    isSignedUp: state.auth.isSignedUp,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = {
  signUpUserWithEmail,
};

UsernameScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape().isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isSignedUp: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  signUpUserWithEmail: PropTypes.func.isRequired,
};

UsernameScreen.defaultProps = {
  isSignedUp: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsernameScreen);
