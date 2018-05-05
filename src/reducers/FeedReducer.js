import { SHOW_RECD_MODAL, HIDE_RECD_MODAL, GET_SPOTIFY_ACCESS_TOKEN_SUCCESS, GET_SPOTIFY_ACCESS_TOKEN_FAILURE } from '../actions/types';

const INITIAL_STATE = {
  recdModalVisible: false,
  spotifyAccessToken: '',
  spotifyTokenError: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SHOW_RECD_MODAL:
      return { ...state, recdModalVisible: true };
    case HIDE_RECD_MODAL:
      return { ...state, recdModalVisible: false };
    case GET_SPOTIFY_ACCESS_TOKEN_SUCCESS:
      return { ...state, spotifyAccessToken: action.payload };
    case GET_SPOTIFY_ACCESS_TOKEN_FAILURE:
      return { ...state, spotifyTokenError: true };
    default:
      return state;
  }
};
