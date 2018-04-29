import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, KeyboardAvoidingView } from 'react-native';
import { Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUserWithFacebook } from '../actions/AuthActions';
import { Spinner } from '../components/common';

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
      userEmail: "",
      userPassword: "",
      passwordConfirmation: "",
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
    console.log(this.state);

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

    if (isEmailValid && isPasswordValid && isConfirmationValid) {
      // TODO: Move to the next Screen
    }
  }

  // TODO: Needs to have a way to validate email
  validateEmail(email) {
    return true;
  }

  renderFacebookLoginButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        title="Sign Up with Facebook"
        onPress={this.props.loginUserWithFacebook}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAvoidingView contentContainerStyle={styles.keyboardContainer} behavior="position">
          <View style={styles.logoContainer}>
            <Text>Rec&#39;d{/* &39; is HTML entity for single quote */} </Text>
          </View>

          <View style={styles.formContainer}>
            <Input
              value={this.state.userEmail}
              keyboardAppearance="light"
              autoFocus={false}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              ref={(input) => { this.emailInput = input; }}
              inputStyle={{ marginLeft: 10 }}
              placeholder="Email"
              containerStyle={{ borderBottomColor: 'rgba(0, 0, 0, 0.38)' }}
              onChangeText={userEmail => this.setState({ userEmail })}
              errorMessage={this.state.isEmailValid ? null : 'Please enter a valid email address'}
            />
            <Input
              value={this.state.userPassword}
              keyboardAppearance="light"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              blurOnSubmit = {true}
              secureTextEntry = {true}
              inputStyle={{ marginLeft: 10 }}
              ref={(input) => { this.passwordInput = input; }}
              placeholder="Password"
              containerStyle={{ marginTop: 16, borderBottomColor: 'rgba(0, 0, 0, 0.38)' }}
              onChangeText={userPassword => this.setState({ userPassword })}
              errorMessage={this.state.isPasswordValid ? null : 'Please enter at least 8 characters'}
            />
            <Input
              value={this.state.passwordConfirmation}
              keyboardAppearance="light"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              blurOnSubmit = {true}
              secureTextEntry = {true}
              inputStyle={{ marginLeft: 10 }}
              ref={(input) => { this.confirmationInput = input; }}
              placeholder="Confirm password"
              containerStyle={{ marginTop: 16, borderBottomColor: 'rgba(0, 0, 0, 0.38)' }}
              onChangeText={passwordConfirmation => this.setState({ passwordConfirmation })}
              errorMessage={this.state.isConfirmationValid ? null : 'Please enter the same password'}
            />
          </View>
          <Button
            title="Sign Up"
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
