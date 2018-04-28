import Expo from 'expo';
import firebase from 'firebase';
import { FACEBOOK } from '../constants';
import { LOADING_AUTH_USER, LOGIN_USER_SUCCESS, LOGOUT_USER_SUCCESS, USER_ALREADY_LOGGED_IN, LOGIN_USER_FAIL } from './types';

export const loginUserWithFacebook = () => {
  return async (dispatch) => {
    // Set loading
    dispatch({ type: LOADING_AUTH_USER });
    try {
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK.APP_ID, {
        permissions: FACEBOOK.PERMISIONS,
        behaviour: 'web',
      });
      if (type === 'success') {
        // Build Firebase credential with Facebook access token
        // Set token to persist even if app is closed
        // Sign in with credential from the Facebook user.
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
        await firebase.auth().signInWithCredential(credential);
        const { displayName } = firebase.auth().currentUser;
        dispatch({
          type: LOGIN_USER_SUCCESS,
        });
        console.log(`Logged in ${displayName}`);
      } else {
        // Facebook Login Errors
        // Note: if type = 'cancel' user cancelled login
        dispatch({
          type: LOGIN_USER_FAIL,
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: LOGIN_USER_FAIL,
      });
    }
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({ type: LOADING_AUTH_USER });

    await firebase.auth().signOut();
    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });
    console.log("logged out");
  };
};

export const userAlreadyLoggedIn = () => {
  return {
    type: USER_ALREADY_LOGGED_IN,
  };
};

// TODO: (STANDALONE)
// Need to configure auth for building the app outside Expo
// See https://docs.expo.io/versions/v27.0.0/sdk/facebook#ios-standalone-appadd-your-apps-bundle-id

// Notes:
// To access Facebook Graph API
// const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
// https://blog.expo.io/using-expos-facebook-api-3b24d8f9ab3d
//
// Firebase Auth Errors:
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithCredential