import React, { Component } from 'react';
import { View, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Font } from 'expo';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './src/reducers';
import { FIREBASE } from './src/constants';
import RootNavigator from './src/navigation/RootNavigator';

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(ReduxThunk)));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class App extends Component {
  state = {
    isFontReady: false,
    isLoggedIn: false,
    isAuthReady: false,
  }

  componentWillMount() {
    console.log('app mount');
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
      console.log('checking auth');
      if (user != null) {
        console.log(user);
        // this.props.userAlreadyLoggedIn();
        this.setState({ isLoggedIn: true });
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
      'pt-sans-bold': require('./assets/fonts/PT_Sans-Web-Bold.ttf'),
      'pt-sans-regular': require('./assets/fonts/PT_Sans-Web-Regular.ttf'),
    }).then(() => {
      this.setState({ isFontReady: true });
    }).catch(() => {
      console.error('Error loading fonts');
    });
  }

  render() {
    const RootNav = RootNavigator(this.state.isLoggedIn);
    if (this.state.isFontReady && this.state.isAuthReady) {
      return (
        <Provider store={store}>
          <RootNav />
        </Provider>
      );
    }
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    );
  }
}

export default App;
