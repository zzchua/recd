import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOADING_AUTH_USER,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  LOADING_USER_EMAIL_SIGNUP,
  LOGIN_USER_FAIL_NO_USER,
  LOGIN_USER_FAIL_WRONG_PASSWORD,
  LOGIN_USER_FAIL_INVALID_EMAIL,
  LOGIN_USER_FAIL_USER_DISABLED,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  error: false,
  isLoggedIn: false,
  uid: '',
  errorWrongPassword: false,
  errorNoUser: false,
  errorInvalidEmail: false,
  errorUserDisabled: false,
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
        isLoggedIn: true,
        loading: false,
        uid: action.payload.uid,
        error: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        error: true,
      };
    case LOGIN_USER_FAIL_NO_USER:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: true,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_WRONG_PASSWORD:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        errorWrongPassword: true,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_INVALID_EMAIL:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: true,
        errorUserDisabled: false,
      };
    case LOGIN_USER_FAIL_USER_DISABLED:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        errorWrongPassword: false,
        errorNoUser: false,
        errorInvalidEmail: false,
        errorUserDisabled: true,
      };
    case LOGOUT_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
        uid: '',
        isSignedUp: false,
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        isSignedUp: true,
        uid: action.payload.uid,
        loading: false,
      };
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        isSignedUp: false,
        error: true,
        loading: false,
      };
    case LOADING_USER_EMAIL_SIGNUP:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};
