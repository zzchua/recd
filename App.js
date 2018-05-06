import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import firebase from 'firebase';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './src/reducers';
import { FIREBASE } from './src/constants';
import RootNavigator from './src/navigation/RootNavigator';

const store = createStore(reducers, {}, composeWithDevTools(applyMiddleware(ReduxThunk)));

class App extends Component {
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

    // This is needed so behavior for Date objects in Firestore cannot break the app
    // This will create a warning related to timer being set for long period of time
    // This can only be fix by react-native, which hasn't been done yet.
    // To follow the issue, click here: https://github.com/facebook/react-native/issues/12981
    const settings = {
      timestampsInSnapshots: true,
    };
    firebase.firestore().settings(settings);
  }

  render() {
    return (
      <Provider store={store}>
        <RootNavigator />
      </Provider>
    );
  }
}

export default App;
