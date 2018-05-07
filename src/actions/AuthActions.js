import Expo from 'expo';
import firebase from 'firebase';
import { FACEBOOK } from '../constants';
import {
  LOADING_AUTH_USER, LOGIN_USER_SUCCESS, LOGOUT_USER_SUCCESS,
  LOGIN_USER_FAIL, SIGNUP_USER_FAIL,
  SIGNUP_USER_SUCCESS,
} from './types';

require('firebase/firestore');

export const userAlreadyLoggedIn = () => {
  return {
    type: LOGIN_USER_SUCCESS,
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
      // TODO: Needs to figure out how to handle or log errors
      console.log(error);
      dispatch({
        type: LOGIN_USER_FAIL,
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

export const addUserToDatabase = (email, username, photo, firstname, lastname, uid) => {
  // TODO: We would want to separate this into database functions
  const db = firebase.firestore();
  db.collection('users').doc(username).set({
    email,
    photo,
    firstname,
    lastname,
    uid,
  })
    .then((docRef) => {
      console.log('Document written with ID: ', docRef.id);
    })
    .catch((error) => {
      console.log('Error adding document: ', error);
    });
};

export const signUpUserWithEmail = (userInfo) => {
  const {
    userEmail,
    userPassword,
    username,
    userImage,
    userFirstName,
    userLastName,
  } = userInfo;

  const userFullName = userLastName.length > 0 ? `${userFirstName} ${userLastName}` : `${userFirstName}`;

  return async (dispatch) => {
    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword)
      .then((user) => {
        // Create user successfully
        const storageLocation = `users/${user.uid}/photos/profile.jpg`;
        uploadProfilePicture(userImage, storageLocation)
          .then((photoURL) => {
            user.updateProfile({
              displayName: userFullName,
              photoURL,
              username,
            }).then(() => {
              dispatch({
                // Add display name successfully
                type: SIGNUP_USER_SUCCESS,
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
