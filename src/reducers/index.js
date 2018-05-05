import { combineReducers } from 'redux';
import AuthReducer from './AuthReducer';
import FeedReducer from './FeedReducer';
import RecdModalReducer from './RecdModalReducer';

export default combineReducers({
  auth: AuthReducer,
  feed: FeedReducer,
  recdModal: RecdModalReducer,
});
