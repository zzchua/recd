import {
  GET_SPOTIFY_ACCESS_TOKEN_SUCCESS,
  GET_SPOTIFY_ACCESS_TOKEN_FAILURE,
  GET_RECD_ITEMS_LOADING,
  GET_RECD_ITEMS_SUCCESS,
  GET_RECD_ITEMS_FAILURE,
  REFRESH_RECD_ITEMS_LOADING,
  REFRESH_RECD_ITEMS_SUCCESS,
  REFRESH_RECD_ITEMS_FAILURE,
} from '../actions/types';

const INITIAL_STATE = {
  spotifyAccessToken: '',
  spotifyTokenError: false,
  feedList: [],
  loading: false,
  errorLoadingFeed: false,
  errorRefreshingFeed: false,
  refreshingFeed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SPOTIFY_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        spotifyAccessToken: action.payload,
      };
    case GET_SPOTIFY_ACCESS_TOKEN_FAILURE:
      return {
        ...state,
        spotifyTokenError: true,
      };
    case GET_RECD_ITEMS_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_RECD_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        feedList: action.payload,
      };
    case GET_RECD_ITEMS_FAILURE:
      return {
        ...state,
        loading: false,
        errorLoadingFeed: true,
      };
    case REFRESH_RECD_ITEMS_LOADING:
      return {
        ...state,
        refreshingFeed: true,
      };
    case REFRESH_RECD_ITEMS_SUCCESS:
      return {
        ...state,
        refreshingFeed: false,
        feedList: action.payload,
        errorRefreshingFeed: false,
      };
    case REFRESH_RECD_ITEMS_FAILURE:
      return {
        ...state,
        refreshingFeed: false,
        errorRefreshingFeed: true,
      };
    default:
      return state;
  }
};
