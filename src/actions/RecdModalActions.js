import axios from 'axios';
import { SPOTIFY_API, FIREBASE_BACKEND_API } from '../constants';
import {
  GET_SPOTIFY_TRACKS_SUCCESS,
  GET_SPOTIFY_TRACKS_FAILURE,
  GET_SPOTIFY_ACCESS_TOKEN_FAILURE,
  GET_SPOTIFY_ACCESS_TOKEN_SUCCESS,
  CLEAR_SEARCH_TRACK_ITEMS,
  RECD_SENT_SUCCESS,
  RECD_SENT_FAILURE,
} from '../actions/types';
import { putUserRecds } from '../database/DatabaseUtils';


// Helper Methods
// Refresh Spotify Access Token
const refreshSpotifyAccessToken = async (dispatch) => {
  try {
    const response = await axios.get(FIREBASE_BACKEND_API.GET_SPOTIFY_ACCESS_TOKEN_URL);
    dispatch({
      type: GET_SPOTIFY_ACCESS_TOKEN_SUCCESS,
      payload: response.data.access_token,
    });
    return response.data.access_token;
  } catch (error) {
    console.error(error);
    dispatch({
      type: GET_SPOTIFY_ACCESS_TOKEN_FAILURE,
    });
    return '';
  }
};

// Search for tracks
const searchSpotifyTracks = async (dispatch, token, searchString) => {
  // const encodedSearchString = encodeURI(searchString);
  const response = await axios.get(SPOTIFY_API.GET_SEARCH_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      q: searchString,
      type: 'track',
      limit: SPOTIFY_API.TRACK_SEARCH_LIMIT,
    },
  });
  return response.data.tracks.items;
};

/**
 * Action to search a list of spotify tracks
 * If access token is expired, will retrieve a new one
 * This is only done once. If an error occurs on the second try, results in error
 */
export const getSpotifyTracks = (token, searchString) => {
  return async (dispatch) => {
    try {
      const trackItems = await searchSpotifyTracks(dispatch, token, searchString);
      dispatch({
        type: GET_SPOTIFY_TRACKS_SUCCESS,
        payload: trackItems,
      });
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        console.log(error.response);
        // Handle Expired Auth Token:
        if (error.response.status === 401) {
          try {
            const refreshedToken = await refreshSpotifyAccessToken(dispatch);
            const trackItems = await searchSpotifyTracks(dispatch, refreshedToken, searchString);
            dispatch({
              type: GET_SPOTIFY_TRACKS_SUCCESS,
              payload: trackItems,
            });
          } catch (errAgain) {
            dispatch({
              type: GET_SPOTIFY_TRACKS_FAILURE,
            });
          }
        }
      } else {
        dispatch({
          type: GET_SPOTIFY_TRACKS_FAILURE,
        });
        if (error.request) {
          // Request made, no response
          console.log(error.request);
        } else {
          console.log(error.message);
        }
      }
    }
  };
};

// TODO: Do we need to dispatch actions?
export const sendRecd = (currentUid, uids, recdItem) => {
  return (dispatch) => {
    putUserRecds(currentUid, uids, recdItem).then(() => {
      console.log('successfully sent recommendations');
      dispatch({
        type: RECD_SENT_SUCCESS,
      });
    }).catch(() => {
      console.log('something went wrong');
      dispatch({
        type: RECD_SENT_FAILURE,
      });
    });
  };
};

/**
 * Clear the search tracks from the most recent search
 */
export const clearSearchTrackItems = () => {
  return {
    type: CLEAR_SEARCH_TRACK_ITEMS,
  };
};
