import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOADING_AUTH_USER,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
  LOADING_USER_EMAIL_SIGNUP,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  error: false,
  isLoggedIn: false,
  uid: '',
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
      };
    case LOGIN_USER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        loading: false,
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
