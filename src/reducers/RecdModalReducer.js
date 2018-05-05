import { GET_SPOTIFY_TRACKS_SUCCESS, GET_SPOTIFY_TRACKS_FAILURE, CLEAR_SEARCH_TRACK_ITEMS } from '../actions/types';

const INITIAL_STATE = {
  searchTrackItems: [],
  searchFailure: false,
};

export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SPOTIFY_TRACKS_SUCCESS:
      return { ...state, searchTrackItems: action.payload };
    case GET_SPOTIFY_TRACKS_FAILURE:
      return { ...state, searchFailure: true };
    case CLEAR_SEARCH_TRACK_ITEMS:
      return { ...state, searchTrackItems: [] };
    default:
      return state;
  }
};
