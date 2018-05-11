import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserWithFacebook, signInWithEmailAndPassword } from '../actions/AuthActions';
import { SignupInput } from '../components/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 2,
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

class LoginScreen extends Component {
  static navigationOptions = {
    title: 'Sign In',
  };

  constructor(props) {
    super(props);
    this.state = {
      userEmail: '',
      userPassword: '',
    };
    this.onLoginWithEmailAndPassword = this.onLoginWithEmailAndPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.navigation.navigate('App');
    }
  }

  onLoginWithEmailAndPassword() {
    this.props.signInWithEmailAndPassword(this.state.userEmail, this.state.userPassword);
  }

  renderFacebookLoginButton() {
    return (
      <Button
        title='Login with Facebook'
        onPress={this.props.loginUserWithFacebook}
      />
    );
  }

  renderEmailErrorMessage() {
    if (this.props.invalidEmailError) {
      return 'Please enter a valid email';
    }
    if (this.props.noUserError) {
      return 'No such user with email address';
    }
    return null;
  }

  renderLoadingSuccessFailure() {
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
            errorMessage={this.renderEmailErrorMessage()}
            returnKeyType='next'
          />
          <SignupInput
            reference={(input) => { this.passwordInput = input; }}
            value={this.state.userPassword}
            isPassword
            placeholder='Password'
            keyboardType='default'
            onChangeText={userPassword => this.setState({ userPassword })}
            errorMessage={this.props.passwordError ? 'Incorrect password' : null}
            returnKeyType='next'
          />
          <Button
            title='Login'
            onPress={this.onLoginWithEmailAndPassword}
          />
        </View>
        <View style={styles.loginContainer}>
          {this.renderFacebookLoginButton()}
        </View>
        <View style={styles.logoContainer}>
          <Button
            title='Sign up'
            onPress={() => {}}
          />
        </View>
        {this.renderLoadingSuccessFailure()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.auth.isLoggedIn,
    loading: state.auth.loading,
    passwordError: state.auth.errorWrongPassword,
    noUserError: state.auth.errorNoUser,
    invalidEmailError: state.auth.errorInvalidEmail,
    disabledUserError: state.auth.errorUserDisabled,
  };
};

const mapDispatchToProps = {
  loginUserWithFacebook,
  signInWithEmailAndPassword,
};

LoginScreen.propTypes = {
  passwordError: PropTypes.bool.isRequired,
  noUserError: PropTypes.bool.isRequired,
  disabledUserError: PropTypes.bool.isRequired,
  invalidEmailError: PropTypes.bool.isRequired,
  loginUserWithFacebook: PropTypes.func.isRequired,
  signInWithEmailAndPassword: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
