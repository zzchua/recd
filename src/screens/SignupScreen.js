import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, KeyboardAvoidingView } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserWithFacebook } from '../actions/AuthActions';
import { Spinner, SignupInput } from '../components/common';

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
      isPasswordValid: true,
      isConfirmationValid: true,
    };

    this.moveToNameScreen = this.moveToNameScreen.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.navigation.navigate('App');
    }
  }

  moveToNameScreen() {
    const {
      userEmail,
      userPassword,
      passwordConfirmation,
      isEmailValid,
      isPasswordValid,
      isConfirmationValid,
    } = this.state;

    this.setState({
      isEmailValid: this.validateEmail(userEmail) || this.emailInput.shake(),
      isPasswordValid: userPassword.length >= 8 || this.passwordInput.shake(),
      isConfirmationValid: userPassword === passwordConfirmation || this.confirmationInput.shake(),
    });

    if (isEmailValid && isPasswordValid && isConfirmationValid
      && userEmail.length > 0 && userPassword.length > 0) {
      this.props.navigation.navigate('Fullname', {
        userEmail,
        userPassword,
      });
    }
  }

  // TODO: Needs to have a way to validate email
  validateEmail(email) {
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    return regex.test(String(email).toLowerCase());
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
              errorMessage={this.state.isEmailValid ? null : 'Please enter a valid email address'}
              returnKeyType='next'
            />
            <SignupInput
              reference={(input) => { this.passwordInput = input; }}
              value={this.state.userPassword}
              isPassword={true}
              placeholder='Password'
              keyboardType='default'
              onChangeText={userPassword => this.setState({ userPassword })}
              errorMessage={this.state.isPasswordValid ? null : 'Please enter at least 8 characters'}
              returnKeyType='next'
            />
            <SignupInput
              reference={(input) => { this.confirmationInput = input; }}
              value={this.state.passwordConfirmation}
              isPassword={true}
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
