/**
 * Firebase
 */
export const FIREBASE = {
  API_KEY: 'AIzaSyBpz-cQydB4KV8xvKobXXK_OJY2LPKQRvg',
  AUTH_DOMAIN: 'recd-app.firebaseapp.com',
  DATABASE_URL: 'https://recd-app.firebaseio.com',
  PROJECT_ID: 'recd-app',
  STORAGE_BUCKET: 'recd-app.appspot.com',
  MESSAGING_SENDER_ID: '380026528326',
};

/**
 * Facebook
 */
export const FACEBOOK = {
  APP_ID: '1806188016109251',
  GRAPH_API_URL: 'https://graph.facebook.com/me',
  PERMISIONS: ['public_profile', 'email'],
};

export const FIREBASE_BACKEND_API = {
  GET_SPOTIFY_ACCESS_TOKEN_URL: 'https://us-central1-recd-app.cloudfunctions.net/retrieveSpotifyAccessToken',
};

export const SPOTIFY_API = {
  GET_SEARCH_URL: 'https://api.spotify.com/v1/search',
  TRACK_SEARCH_LIMIT: 5,
};
