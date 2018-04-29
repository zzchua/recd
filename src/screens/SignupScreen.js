import React, { Component } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
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
    flex: 2,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signupContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class SignupScreen extends Component {
  static navigationOptions = {
    title: 'Sign up',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn) {
      this.props.navigation.navigate('App');
    }
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
        <View style={styles.logoContainer}>
          <Text>Rec&#39;d{/* &39; is HTML entity for single quote */} </Text>
        </View>
        <View style={styles.signupContainer}>
          <Text style={{ color: 'blue' }}>Sign Up with Email Address or Phone Number</Text>
        </View>
        <View style={styles.loginContainer}>
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
