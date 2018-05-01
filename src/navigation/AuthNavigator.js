import { StackNavigator } from 'react-navigation';
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
    headerMode: 'none',
  },
);

// Note:
// Use this to move the header down below the status bar,
// this is not done out of the box for android
// headerStyle: {paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}
