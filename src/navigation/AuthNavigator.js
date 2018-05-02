import { StackNavigator } from 'react-navigation';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import FullnameScreen from '../screens/FullnameScreen';
import UsernameScreen from '../screens/UsernameScreen';

export default StackNavigator(
  {
    SignIn: {
      screen: LoginScreen,
    },
    SignUp: {
      screen: SignupScreen,
    },
    Fullname: {
      screen: FullnameScreen,
    },
    Username: {
      screen: UsernameScreen,
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
