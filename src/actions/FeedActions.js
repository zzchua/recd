import axios from 'axios';
import { FIREBASE_BACKEND_API } from '../constants';
import { GET_SPOTIFY_ACCESS_TOKEN_SUCCESS, GET_SPOTIFY_ACCESS_TOKEN_FAILURE } from './types';

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
