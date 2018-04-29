import { StackNavigator } from 'react-navigation';
import { Platform, StatusBar } from 'react-native';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';

export default StackNavigator(
  {
    SignIn: {
      screen: LoginScreen,
    },
    SignUp: {
      screen: SignupScreen,
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
