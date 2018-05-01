import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import firebase from 'firebase';
import { userAlreadyLoggedIn } from '../actions/AuthActions';

class AuthLoadingScreen extends Component {
  componentWillMount() {
    console.log('auth screen mount');
    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      console.log('checking auth');
      if (user != null) {
        console.log(user);
        this.props.userAlreadyLoggedIn();
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Auth');
      }
      // Do other things
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapDispatchToProps = {
  userAlreadyLoggedIn,
};

AuthLoadingScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  userAlreadyLoggedIn: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(AuthLoadingScreen);
