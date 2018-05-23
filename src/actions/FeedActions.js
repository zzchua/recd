import axios from 'axios';
import { FIREBASE_BACKEND_API } from '../constants';
import { getRecdItems } from '../database/DatabaseUtils';
import {
  GET_SPOTIFY_ACCESS_TOKEN_SUCCESS,
  GET_SPOTIFY_ACCESS_TOKEN_FAILURE,
  GET_RECD_ITEMS_SUCCESS,
  GET_RECD_ITEMS_LOADING,
  GET_RECD_ITEMS_FAILURE,
  REFRESH_RECD_ITEMS_LOADING,
  REFRESH_RECD_ITEMS_SUCCESS,
  REFRESH_RECD_ITEMS_FAILURE,
} from './types';

/**
 * This action retrieves a spotify access token
 */
export const getSpotifyAccessToken = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(FIREBASE_BACKEND_API.GET_SPOTIFY_ACCESS_TOKEN_URL);
      dispatch({
        type: GET_SPOTIFY_ACCESS_TOKEN_SUCCESS,
        payload: response.data.access_token,
      });
    } catch (error) {
      // TODO: Figure a way to log errors
      console.error(error);
      dispatch({
        type: GET_SPOTIFY_ACCESS_TOKEN_FAILURE,
      });
    }
  };
};

// TODO: Handle Pagination
export const retrieveRecdItems = (uid) => {
  return (dispatch) => {
    dispatch({
      type: GET_RECD_ITEMS_LOADING,
    });
    getRecdItems(uid).then((querySnapshot) => {
      const feedItems = [];
      querySnapshot.forEach((item) => {
        feedItems.push({ id: item.id, data: item.data() });
      });
      dispatch({
        type: GET_RECD_ITEMS_SUCCESS,
        payload: feedItems,
      });
    }).catch(() => {
      dispatch({
        type: GET_RECD_ITEMS_FAILURE,
      });
    });
  };
};

export const refreshFeed = (uid) => {
  return (dispatch) => {
    dispatch({
      type: REFRESH_RECD_ITEMS_LOADING,
    });
    getRecdItems(uid).then((querySnapshot) => {
      const feedItems = [];
      querySnapshot.forEach((item) => {
        feedItems.push({ id: item.id, data: item.data() });
      });
      dispatch({
        type: REFRESH_RECD_ITEMS_SUCCESS,
        payload: feedItems,
      });
    }).catch(() => {
      dispatch({
        type: REFRESH_RECD_ITEMS_FAILURE,
      });
    });
  };
};
