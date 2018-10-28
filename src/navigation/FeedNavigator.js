import { StackNavigator } from 'react-navigation';
import SearchRecdScreen from '../screens/SearchRecdScreen';
import SendRecdScreen from '../screens/SendRecdScreen';
import FeedScreen from '../screens/FeedScreen';

export default StackNavigator(
  {
    Feed: {
      screen: FeedScreen,
    },
    RecdSearch: {
      screen: SearchRecdScreen,
    },
    RecdSend: {
      screen: SendRecdScreen,
    },
  },
  {
    initialRouteName: 'Feed',
  },
);
