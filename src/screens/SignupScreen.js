import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserWithFacebook } from '../actions/AuthActions';
import { Spinner, SignupInput } from '../components/common';
import { MINIMUM_PASSWORD_LENGTH } from '../constants';
import { getUserByEmail } from '../database/DatabaseUtils';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardContainer: {
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
});

class SignupScreen extends Component {
  static navigationOptions = {
    title: 'Sign up',
  };

  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
      passwordConfirmation: '',
      isEmailValid: true,
      isEmailUnique: true,
      isPasswordValid: true,
      isConfirmationValid: true,
    };

    this.moveToNameScreen = this.moveToNameScreen.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.validateConfirmationPassword = this.validateConfirmationPassword.bind(this);
    this.validateEmailAddressFormat = this.validateEmailAddressFormat.bind(this);
    this.validateEmailUnique = this.validateEmailUnique.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.navigation.navigate('App');
    }
  }

  async moveToNameScreen() {
    let isEmailUnique = true;
    const isEmailValid = this.validateEmailAddressFormat();
    if (isEmailValid) {
      isEmailUnique = await this.validateEmailUnique();
    }
    const isPasswordValid = this.validatePassword();
    const isConfirmationValid = this.validateConfirmationPassword();

    if (isEmailUnique && isEmailValid && isPasswordValid && isConfirmationValid) {
      const userInfo = {
        userEmail: this.state.userEmail,
        userPassword: this.state.userPassword,
      };
      this.props.navigation.navigate('Fullname', {
        userInfo,
      });
    }
  }

  validateEmailAddressFormat() {
    const email = this.state.userEmail;
    const isValid = this.validateEmailFormat(email);
    this.setState({ isEmailValid: isValid });
    if (!isValid) {
      this.emailInput.shake();
    }
    return isValid;
  }

  async validateEmailUnique() {
    const email = this.state.userEmail;
    const querySnapshot = await getUserByEmail(email);
    const isEmailUnique = querySnapshot.size === 0;
    this.setState({ isEmailUnique });
    if (!isEmailUnique) {
      this.emailInput.shake();
    }
    return isEmailUnique;
  }

  validatePassword() {
    const { userPassword } = this.state;
    const isPasswordValid = userPassword.length >= MINIMUM_PASSWORD_LENGTH;
    this.setState({ isPasswordValid });
    if (!isPasswordValid) {
      this.passwordInput.shake();
    }
    return isPasswordValid;
  }

  validateConfirmationPassword() {
    const { passwordConfirmation, userPassword } = this.state;
    const isConfirmationValid = passwordConfirmation === userPassword;
    this.setState({ isConfirmationValid });
    if (!isConfirmationValid) {
      this.confirmationInput.shake();
    }
    return isConfirmationValid;
  }

  validateEmailFormat(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.length > 0 && regex.test(String(email).toLowerCase());
  }

  renderFacebookLoginButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        title='Sign Up with Facebook'
        onPress={this.props.loginUserWithFacebook}
      />
    );
  }

  renderErrorMessage() {
    if (!this.state.isEmailValid) {
      return 'Please enter a valid email address';
    }
    if (!this.state.isEmailUnique) {
      return 'This email has already been registered';
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView contentContainerStyle={styles.keyboardContainer} behavior='position'>
          <View style={styles.logoContainer}>
            <Text>Rec&#39;d{/* &39; is HTML entity for single quote */} </Text>
          </View>

          <View style={styles.formContainer}>
            <SignupInput
              value={this.state.userEmail}
              reference={(input) => { this.emailInput = input; }}
              isPassword={false}
              placeholder='Email'
              keyboardType='email-address'
              onChangeText={userEmail => this.setState({ userEmail })}
              errorMessage={this.renderErrorMessage()}
              returnKeyType='next'
            />
            <SignupInput
              reference={(input) => { this.passwordInput = input; }}
              value={this.state.userPassword}
              isPassword
              placeholder='Password'
              keyboardType='default'
              onChangeText={userPassword => this.setState({ userPassword })}
              errorMessage={this.state.isPasswordValid ? null : `Please enter at least ${MINIMUM_PASSWORD_LENGTH} characters`}
              returnKeyType='next'
            />
            <SignupInput
              reference={(input) => { this.confirmationInput = input; }}
              value={this.state.passwordConfirmation}
              isPassword
              placeholder='Confirm password'
              keyboardType='default'
              onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
              errorMessage={this.state.isConfirmationValid ? null : 'Please enter the same password'}
              returnKeyType='done'
            />
          </View>
          <Button
            title='Sign Up'
            onPress={this.moveToNameScreen}
          />
        </KeyboardAvoidingView>
        <View>
          <Text>Or</Text>
        </View>

        <View style={styles.loginContainer}>
          {this.renderFacebookLoginButton()}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = {
  loginUserWithFacebook,
};

SignupScreen.propTypes = {
  loginUserWithFacebook: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupScreen);
