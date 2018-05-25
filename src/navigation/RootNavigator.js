import { SwitchNavigator } from 'react-navigation';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

export default (uid) => {
  return SwitchNavigator(
    {
      App: {
        screen: AppNavigator,
      },
      Auth: {
        screen: AuthNavigator,
      },
    },
    {
      initialRouteName: uid !== '' ? 'App' : 'Auth',
    },
  );
};
