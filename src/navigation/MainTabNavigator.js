import { TabNavigator } from 'react-navigation';
import FeedScreen from '../screens/FeedScreen';
import ProfileScreen from '../screens/ProfileScreen';

export default TabNavigator(
  {
    Feed: {
      screen: FeedScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    tabBarPosition: 'bottom',
  },
);
