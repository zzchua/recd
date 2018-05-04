import axios from 'axios';
import { FIREBASE_BACKEND_API } from '../constants';

export const getSpotifyAccessToken = async () => {
  try {
    const response = await axios.get(FIREBASE_BACKEND_API.GET_SPOTIFY_ACCESS_TOKEN_URL);
    return response.access_token;
  } catch (error) {
    console.error(error);
    return '';
  }
};
