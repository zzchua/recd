import Expo from 'expo';
import firebase from 'firebase';
import axios from 'axios';
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
  SIGNUP_USER_LOADING, LOGIN_USER_FAIL_WRONG_PASSWORD, LOGIN_USER_FAIL_NO_USER,
  LOGIN_USER_FAIL_INVALID_EMAIL, LOGIN_USER_FAIL_USER_DISABLED,
  GET_SECONDARY_USER_INFO_SUCCESS,
  GET_SECONDARY_USER_INFO_NOT_FOUND,
  GET_SECONDARY_USER_INFO_FAILURE,
  FACEBOOK_LOGIN_NEW_USER,
  FACEBOOK_LOGIN_EXISTING_USER,
  UPDATE_USER_PROFILE_LOADING,
  UPDATE_USER_PROFILE_ERROR,
  UPDATE_USER_PROFILE_SUCCESS,
} from './types';
import {
  addUserToDatabase,
  getUserByUid,
  updateUserDetailsToDatabase,
} from '../database/DatabaseUtils';

require('firebase/firestore');

export const getSecondaryUserInfo = (uid) => {
  return (dispatch) => {
    getUserByUid(uid).then((doc) => {
      if (doc.exists) {
        dispatch({
          type: GET_SECONDARY_USER_INFO_SUCCESS,
          payload: {
            username: doc.data().username,
          },
        });
      } else {
        dispatch({
          type: GET_SECONDARY_USER_INFO_NOT_FOUND,
        });
      }
    }).catch((error) => {
      console.log(error);
      dispatch({
        type: GET_SECONDARY_USER_INFO_FAILURE,
      });
    });
  };
};

export const userLoggedIn = ({
  uid, displayName, email, photoURL,
}) => {
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      uid,
      displayName,
      email,
      photoUrl: photoURL,
    },
  };
};

export const uploadProfilePicture = async (uri, uid) => {
  const storageLocation = `users/${uid}/photos/profile.jpg`;
  const response = await fetch(uri);
  const blob = await response.blob();
  const ref = firebase.storage().ref(storageLocation);
  const snapshot = await ref.put(blob);
  return snapshot.downloadURL;
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
        const { user, additionalUserInfo } =
          await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        // If is a new fb signup, we need to get a large profile picture 
        // as well as get secondary details
        if (additionalUserInfo.isNewUser) {
          try {
            const response = await axios.get(`${FACEBOOK.GRAPH_API_URL}me?access_token=${token}`);
            const fbUid = response.data.id;
            const fbProfilePicGetURL = `${FACEBOOK.GRAPH_API_URL}${fbUid}/picture?type=large&access_token=${token}`;
            const photoUrl = await uploadProfilePicture(fbProfilePicGetURL, user.uid);
            await user.updateProfile({ photoUrl });
            dispatch({
              type: FACEBOOK_LOGIN_NEW_USER,
              payload: {
                photoUrl,
              },
            });
          } catch (error) {
            // TODO: Need to handle this error of failing to upload large picture
            console.log(error);
          }
        } else {
          dispatch({ type: FACEBOOK_LOGIN_EXISTING_USER });
        }
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
      type: SIGNUP_USER_LOADING,
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
        uploadProfilePicture(userImage, user.uid)
          .then((photoUrl) => {
            user.updateProfile({
              displayName,
              photoUrl,
            }).then(() => {
              dispatch({
                // Add display name successfully
                type: SIGNUP_USER_SUCCESS,
                payload: {
                  uid: user.uid,
                  photoUrl,
                  username,
                  displayName,
                },
              });
              addUserToDatabase(username, userFirstName, userLastName, photoUrl, userEmail, user.uid)
                .catch((error) => {
                  console.log(error);
                  dispatch({
                    type: SIGNUP_USER_FAIL,
                  });
                });
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
// TODO: Simplify this, just update email, and photo, but dont do the upload?

/**
 * Updates user's firebase profile and adds user record to database
 * This should only be used for a new user who logs in via Facebook
 * @param {*} email the email to be updated and added
 * @param {*} username 
 * @param {*} firstName 
 * @param {*} lastName 
 * @param {*} photoUri the uri of the picture to upload or '' if not required to update
 */
export const updateFirebaseUserAndAddSecondaryDetails =
  (email, username, firstName, lastName, photoUri) => {
    const user = firebase.auth().currentUser;
    const displayName = lastName.length > 0 ? `${firstName} ${lastName}` : `${firstName}`;
    let { photoURL } = user;
    return async (dispatch) => {
      dispatch({ type: UPDATE_USER_PROFILE_LOADING });
      try {
        // Update email in Firebase Auth
        await user.updateEmail(email);

        // Update Display Name in Firebase Auth
        await user.updateProfile({ displayName });

        // Upload new picture if any, and update in Firebase Auth
        if (photoUri !== '') {
          photoURL = await uploadProfilePicture(photoUri, user.uid);
          await user.updateProfile({ photoURL });
        }
        updateUserDetailsToDatabase(username, firstName, lastName, photoURL, email, user.uid);
      } catch (error) {
        dispatch({ type: UPDATE_USER_PROFILE_ERROR });
      }
      dispatch({
        type: UPDATE_USER_PROFILE_SUCCESS,
        payload: {
          username,
          photoUrl: photoURL, // we use photoUrl, google uses photoURL
          displayName,
          email,
        },
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
