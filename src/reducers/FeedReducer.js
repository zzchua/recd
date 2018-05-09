import { GET_SPOTIFY_ACCESS_TOKEN_SUCCESS, GET_SPOTIFY_ACCESS_TOKEN_FAILURE, GET_RECD_ITEMS_LOADING, GET_RECD_ITEMS_SUCCESS, GET_RECD_ITEMS_FAILURE } from '../actions/types';

const INITIAL_STATE = {
  spotifyAccessToken: '',
  spotifyTokenError: false,
  feedList: [],
  loading: false,
  errorLoadingFeed: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SPOTIFY_ACCESS_TOKEN_SUCCESS:
      return { ...state, spotifyAccessToken: action.payload };
    case GET_SPOTIFY_ACCESS_TOKEN_FAILURE:
      return { ...state, spotifyTokenError: true };
    case GET_RECD_ITEMS_LOADING:
      return { ...state, loading: true };
    case GET_RECD_ITEMS_SUCCESS:
      return { ...state, loading: false, feedList: action.payload };
    case GET_RECD_ITEMS_FAILURE:
      return { ...state, loading: false, errorLoadingFeed: true };
    default:
      return state;
  }
};
