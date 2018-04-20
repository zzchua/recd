import { SwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default SwitchNavigator(
  {
    App: {
      screen: MainTabNavigator,
    },
    Auth: {
      screen: AuthNavigator,
    },
    AuthLoading: {
      screen: AuthLoadingScreen,
    },
  },
  {
    initialRouteName: 'AuthLoading',
  },
);
