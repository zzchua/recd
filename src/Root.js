import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Font } from 'expo';
import firebase from 'firebase';
import { FIREBASE } from './constants';
import RootNavigator from './navigation/RootNavigator';
import { userLoggedIn, getSecondaryUserInfo } from './actions/AuthActions';

const styles = StyleSheet.create({
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

class Root extends Component {
  state = {
    isFontReady: false,
    isAuthReady: false,
  }

  componentWillMount() {
    console.log('root component mounted');
    // Initialize Firebase
    firebase.initializeApp({
      apiKey: FIREBASE.API_KEY,
      authDomain: FIREBASE.AUTH_DOMAIN,
      databaseURL: FIREBASE.DATABASE_URL,
      projectId: FIREBASE.PROJECT_ID,
      storageBucket: FIREBASE.STORAGE_BUCKET,
      messagingSenderId: FIREBASE.MESSAGE_SENDER_ID,
    });

    // Listen for authentication state to change.
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log('User is logged in');
        this.props.userLoggedIn(user);
        this.props.getSecondaryUserInfo(user.uid);
      } else {
        console.log('User is logged out');
      }
      // Only update this once
      if (!this.state.isAuthReady) {
        this.setState({ isAuthReady: true });
      }
    });

    // This is needed so behavior for Date objects in Firestore cannot break the app
    // This will create a warning related to timer being set for long period of time
    // This can only be fix by react-native, which hasn't been done yet.
    // To follow the issue, click here: https://github.com/facebook/react-native/issues/12981
    const settings = {
      timestampsInSnapshots: true,
    };
    firebase.firestore().settings(settings);

    // Load Fonts
    this.loadFonts();
  }

  loadFonts() {
    Font.loadAsync({
      'pt-sans-bold': require('../assets/fonts/PT_Sans-Web-Bold.ttf'),
      'pt-sans-regular': require('../assets/fonts/PT_Sans-Web-Regular.ttf'),
    }).then(() => {
      this.setState({ isFontReady: true });
    }).catch(() => {
      console.error('Error loading fonts');
    });
  }

  render() {
    const RootNav = RootNavigator(this.props.uid);
    if (this.state.isFontReady && this.state.isAuthReady) {
      return (
        <RootNav />
      );
    }
    return (
      <View style={styles.loading}>
        <ActivityIndicator size='large' />
      </View>
    );
  }
}

Root.propTypes = {
  userLoggedIn: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  getSecondaryUserInfo: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
  };
};

const mapDispatchToProps = {
  userLoggedIn,
  getSecondaryUserInfo,
};

export default connect(mapStateToProps, mapDispatchToProps)(Root);
