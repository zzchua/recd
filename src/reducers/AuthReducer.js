import {
  LOGIN_USER_SUCCESS,
  LOGOUT_USER_SUCCESS,
  LOADING_AUTH_USER,
  LOGIN_USER_FAIL,
  SIGNUP_USER_SUCCESS,
  SIGNUP_USER_FAIL,
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
      console.log(action.payload);
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
      };
    case SIGNUP_USER_SUCCESS:
      return {
        ...state,
        isSignedUp: true,
        uid: action.payload.uid,
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
