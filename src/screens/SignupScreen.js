import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserWithFacebook } from '../actions/AuthActions';
import { Spinner, SignupInput } from '../components/common';
import { MINIMUM_PASSWORD_LENGTH } from '../constants';
import { getEmailUnique } from '../database/DatabaseUtils';

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
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.navigation.navigate('App');
    }
  }

  async moveToNameScreen() {
    const isEmailValid = this.validateEmail(this.state.userEmail);
    const isPasswordValid = this.state.userPassword.length >= MINIMUM_PASSWORD_LENGTH;
    const isConfirmationValid = this.state.userPassword === this.state.passwordConfirmation;

    // Shake any invalid input fields
    if (!isEmailValid) { this.emailInput.shake(); }
    if (!isPasswordValid) { this.passwordInput.shake(); }
    if (!isConfirmationValid) { this.confirmationInput.shake(); }

    // If any of above is invalid, dont proceed
    if (!isEmailValid || !isPasswordValid || !isConfirmationValid) {
      this.setState({
        isEmailValid, isPasswordValid, isConfirmationValid,
      });
      return;
    }

    const isEmailUnique = await this.validatEmailUnique(this.state.userEmail);
    if (isEmailUnique) {
      const userInfo = {
        userEmail: this.state.userEmail,
        userPassword: this.state.userPassword,
      };
      this.props.navigation.navigate('Fullname', {
        userInfo,
      });
    }
    this.setState({
      isEmailValid, isPasswordValid, isConfirmationValid, isEmailUnique,
    });
  }

  // TODO: May validate email using Firebase to ensure uniqueness
  validateEmail(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return email.length > 0 && regex.test(String(email).toLowerCase());
  }

  async validatEmailUnique(email) {
    const querySnapshot = await getEmailUnique(email);
    return querySnapshot.size === 0;
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
