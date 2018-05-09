import {
  GET_SPOTIFY_TRACKS_SUCCESS,
  GET_SPOTIFY_TRACKS_FAILURE,
  CLEAR_SEARCH_TRACK_ITEMS,
  RECD_SENT_SUCCESS,
  RECD_SENT_FAILURE,
  RECD_SENT_LOADING,
  RESET_STATE,
} from '../actions/types';

const INITIAL_STATE = {
  searchTrackItems: [],
  searchFailure: false,
  recdSent: false,
  recdSentFailure: false,
  recdSentLoading: false,
};

export default(state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_SPOTIFY_TRACKS_SUCCESS:
      return { ...state, searchTrackItems: action.payload };
    case GET_SPOTIFY_TRACKS_FAILURE:
      return { ...state, searchFailure: true };
    case CLEAR_SEARCH_TRACK_ITEMS:
      return { ...state, searchTrackItems: [] };
    case RECD_SENT_LOADING:
      return { ...state, recdSentLoading: true };
    case RECD_SENT_SUCCESS:
      return { ...state, recdSent: true, recdSentLoading: false };
    case RECD_SENT_FAILURE:
      return { ...state, recdSentFailure: true, recdSentLoading: false };
    case RESET_STATE:
      return {
        ...INITIAL_STATE,
      };
    default:
      return state;
  }
};
