import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOADING_AUTH_USER,
  USER_ALREADY_LOGGED_IN,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
} from '../actions/types';

const INITIAL_STATE = {
  loading: false,
  error: false,
  isLoggedIn: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOADING_AUTH_USER:
      return {
        ...state,
        loading: true,
      };
    case USER_ALREADY_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true,
        loading: false,
      };
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        loading: false,
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
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        isSignedUp: true,
      };
    case SIGNUP_USER_FAIL:
      return {
        ...state,
        isSignedUp: false,
        error: true,
      };
    default:
      return state;
  }
};
