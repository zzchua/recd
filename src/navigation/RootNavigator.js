import { SwitchNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';

export default (isLoggedIn) => {
  return SwitchNavigator(
    {
      App: {
        screen: MainTabNavigator,
      },
      Auth: {
        screen: AuthNavigator,
      },
    },
    {
      initialRouteName: isLoggedIn ? 'App' : 'Auth',
    },
  );
};
