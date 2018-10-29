import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOADING_AUTH_USER,
  FB_LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  SIGNUP_USER_LOADING,
  LOGIN_USER_FAIL_NO_USER,
  LOGIN_USER_FAIL_WRONG_PASSWORD,
  LOGIN_USER_FAIL_INVALID_EMAIL,
  LOGIN_USER_FAIL_USER_DISABLED,
  GET_SECONDARY_USER_INFO_SUCCESS,
  GET_SECONDARY_USER_INFO_NOT_FOUND,
  FACEBOOK_LOGIN_NEW_USER,
  FACEBOOK_LOGIN_EXISTING_USER,
  UPDATE_USER_PROFILE_ERROR,
  UPDATE_USER_PROFILE_SUCCESS,
  UPDATE_USER_PROFILE_LOADING,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  error: false,
  fbLoginError: false,
  signUpError: false,
  uid: '',
  email: '',
  displayName: '',
  photoUrl: '',
  username: '',
  errorWrongPassword: false,
  errorNoUser: false,
  errorInvalidEmail: false,
  errorUserDisabled: false,
  isFacebookNewUser: false,
  updateUserProfileError: false,
  userProfileUpdated: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_AUTH_USER:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        uid: action.payload.uid,
        displayName: action.payload.displayName,
        email: action.payload.email,
        photoUrl: action.payload.photoUrl,
        fbLoginError: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case FB_LOGIN_USER_FAIL:
      return {
        ...state,
        loading: false,
        fbLoginError: true,
      };
    case LOGIN_USER_FAIL_NO_USER:
      return {
        ...state,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: true,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_WRONG_PASSWORD:
      return {
        ...state,
        loading: false,
        errorWrongPassword: true,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_INVALID_EMAIL:
      return {
        ...state,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: true,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_USER_DISABLED:
      return {
        ...state,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: true,
      };
    case GET_SECONDARY_USER_INFO_SUCCESS:
      return {
        ...state,
        username: action.payload.username,
      };
    case GET_SECONDARY_USER_INFO_NOT_FOUND:
      return {
        ...state,
      };
    case FACEBOOK_LOGIN_NEW_USER:
      return {
        ...state,
        isFacebookNewUser: true,
        photoUrl: action.payload.photoUrl,
      };
    case FACEBOOK_LOGIN_EXISTING_USER:
      return {
        ...state,
        isFacebookNewUser: false,
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        uid: action.payload.uid,
        displayName: action.payload.displayName,
        username: action.payload.username,
        photoUrl: action.payload.photoUrl,
        loading: false,
        signUpError: false,
      };
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        signUpError: true,
        loading: false,
      };
    case SIGNUP_USER_LOADING:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_PROFILE_SUCCESS:
      return {
        ...state,
        loading: false,
        userProfileUpdated: true,
        username: action.payload.username,
        photoUrl: action.payload.photoUrl,
        displayName: action.payload.displayName,
        email: action.payload.email,
      };
    case UPDATE_USER_PROFILE_LOADING:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_PROFILE_ERROR:
      return {
        ...state,
        loading: false,
        userProfileUpdated: false,
      };
    case LOGOUT_USER_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
