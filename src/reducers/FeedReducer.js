import { GET_SPOTIFY_ACCESS_TOKEN_SUCCESS, GET_SPOTIFY_ACCESS_TOKEN_FAILURE } from '../actions/types';

const INITIAL_STATE = {
  spotifyAccessToken: '',
  spotifyTokenError: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SPOTIFY_ACCESS_TOKEN_SUCCESS:
      return { ...state, spotifyAccessToken: action.payload };
    case GET_SPOTIFY_ACCESS_TOKEN_FAILURE:
      return { ...state, spotifyTokenError: true };
    default:
      return state;
  }
};
