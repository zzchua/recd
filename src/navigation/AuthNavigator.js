import { StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import LoginScreen from '../screens/LoginScreen';

export default StackNavigator(
  {
    SignIn: {
      screen: LoginScreen,
    },
  },
  {
    navigationOptions: {
      headerStyle: {
        paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
      },
    },
  },
);
