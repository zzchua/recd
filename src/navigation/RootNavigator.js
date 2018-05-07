import { SwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';

export default (isLoggedIn) => {
  return SwitchNavigator(
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
      initialRouteName: isLoggedIn ? 'App' : 'Auth',
    },
  );
};
