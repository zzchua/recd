import Expo from 'expo';
import firebase from 'firebase';
import {
  FACEBOOK,
  FIREBASE_AUTH_ERROR_INVALID_EMAIL,
  FIREBASE_AUTH_ERROR_USER_DISABLED,
  FIREBASE_AUTH_ERROR_WRONG_PASSWORD,
  FIREBASE_AUTH_ERROR_NO_USER,
} from '../constants';
import {
  LOADING_AUTH_USER, LOGIN_USER_SUCCESS, LOGOUT_USER_SUCCESS,
  FB_LOGIN_USER_FAIL, SIGNUP_USER_FAIL, SIGNUP_USER_SUCCESS,
  LOADING_USER_EMAIL_SIGNUP, LOGIN_USER_FAIL_WRONG_PASSWORD, LOGIN_USER_FAIL_NO_USER,
  LOGIN_USER_FAIL_INVALID_EMAIL, LOGIN_USER_FAIL_USER_DISABLED,
} from './types';
import { addUserToDatabase } from '../database/DatabaseUtils';

require('firebase/firestore');

export const userLoggedIn = (uid) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      uid,
    },
  };
};

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
      } else {
        // Facebook Login Errors
        // Note: if type = 'cancel' user cancelled login
        dispatch({
          type: FB_LOGIN_USER_FAIL,
        });
      }
    } catch (error) {
      // TODO: Needs to figure out how to handle or log errors
      console.log(error);
      dispatch({
        type: FB_LOGIN_USER_FAIL,
      });
    }
  };
};

export const uploadProfilePicture = async (uri, storageLocation) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase.storage().ref(storageLocation);
  const snapshot = await ref.put(blob);

  return snapshot.downloadURL;
};


const titleCase = (str) => {
  const splitStr = str.toLowerCase().split(' ');
  for (let i = 0; i < splitStr.length; i += 1) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(' ');
};

export const signUpUserWithEmail = (userInfo) => {
  return async (dispatch) => {
    dispatch({
      type: LOADING_USER_EMAIL_SIGNUP,
    });

    let {
      userEmail,
      username,
      userFirstName,
      userLastName,
    } = userInfo;

    const {
      userImage,
      userPassword,
    } = userInfo;

    // Ensure strings are consistent in case
    userEmail = userEmail.toLowerCase();
    username = username.toLowerCase();
    userFirstName = titleCase(userFirstName);
    userLastName = titleCase(userLastName);

    // Display name is full name
    const displayName = userLastName.length > 0 ? `${userFirstName} ${userLastName}` : `${userFirstName}`;

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
      .then((user) => {
        // Create user successfully
        const storageLocation = `users/${user.uid}/photos/profile.jpg`;
        uploadProfilePicture(userImage, storageLocation)
          .then((photoURL) => {
            user.updateProfile({
              displayName,
              photoURL,
              username,
            }).then(() => {
              dispatch({
                // Add display name successfully
                type: SIGNUP_USER_SUCCESS,
                payload: {
                  uid: user.uid,
                },
              });
              addUserToDatabase(
                userEmail, username, photoURL,
                userFirstName, userLastName, user.uid,
              );
            }).catch((error) => {
              // Unable to add display name, may want to delete user
              // TODO: Needs to figure out how to handle or log errors
              console.log(error);
              dispatch({
                type: SIGNUP_USER_FAIL,
              });
            });
          })
          .catch((error) => {
            // Unable to create user
            // TODO: Needs to figure out how to handle or log errors
            const { code, message } = error;
            console.log(code);
            console.log(message);

            dispatch({
              type: SIGNUP_USER_FAIL,
            });
          });
      });
  };
};

export const signInWithEmailAndPassword = (email, password) => {
  return (dispatch) => {
    dispatch({
      type: LOADING_AUTH_USER,
    });
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((error) => {
        const errorCode = error.code;
        if (errorCode === FIREBASE_AUTH_ERROR_WRONG_PASSWORD) {
          dispatch({
            type: LOGIN_USER_FAIL_WRONG_PASSWORD,
          });
        } else if (errorCode === FIREBASE_AUTH_ERROR_NO_USER) {
          dispatch({
            type: LOGIN_USER_FAIL_NO_USER,
          });
        } else if (errorCode === FIREBASE_AUTH_ERROR_INVALID_EMAIL) {
          dispatch({
            type: LOGIN_USER_FAIL_INVALID_EMAIL,
          });
        } else if (errorCode === FIREBASE_AUTH_ERROR_USER_DISABLED) {
          dispatch({
            type: LOGIN_USER_FAIL_USER_DISABLED,
          });
        }
      });
  };
};

export const logoutUser = () => {
  return async (dispatch) => {
    dispatch({ type: LOADING_AUTH_USER });

    await firebase.auth().signOut();
    dispatch({
      type: LOGOUT_USER_SUCCESS,
    });
    console.log('logged out');
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
