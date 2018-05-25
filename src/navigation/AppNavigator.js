import { StackNavigator } from 'react-navigation';
import MainTabNavigator from './MainTabNavigator';
import SecondaryDetailsModal from '../screens/SecondaryDetailsScreen';

export default StackNavigator(
  {
    MainApp: {
      screen: MainTabNavigator,
    },
    SecondaryDetailsModal: {
      screen: SecondaryDetailsModal,
    },
  },
  {
    headerMode: 'none',
    mode: 'modal',
  },
);

// Note:
// Use this to move the header down below the status bar,
// this is not done out of the box for android
// headerStyle: {paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight}