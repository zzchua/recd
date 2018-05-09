import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { MaterialIcons } from '@expo/vector-icons';
import FeedNavigator from './FeedNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SearchScreen from '../screens/SearchScreen';

const iconSize = 25;

export default TabNavigator(
  {
    Feed: {
      screen: FeedNavigator,
    },
    Search: {
      screen: SearchScreen,
    },
    Notifications: {
      screen: NotificationsScreen,
    },
    Profile: {
      screen: ProfileScreen,
    },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state;
        let icon;
        switch (routeName) {
          case 'Feed':
            icon = <MaterialIcons name='home' size={iconSize} color={tintColor} />;
            break;
          case 'Search':
            icon = <MaterialIcons name='search' size={iconSize} color={tintColor} />;
            break;
          case 'Notifications':
            icon = <MaterialIcons name='notifications' size={iconSize} color={tintColor} />;
            break;
          case 'Profile':
            icon = <MaterialIcons name='person' size={iconSize} color={tintColor} />;
            break;
          default:
            break;
        }
        return icon;
      },
    }),
    tabBarPosition: 'bottom',
    tabBarOptions: {
      initialRouteName: 'Feed',
      order: ['Feed, Search', 'Notifications', 'Profile'],
      showLabel: false,
      showIcon: true,
      activeTintColor: 'black',
      inactiveTintColor: 'gray',
      style: {
        backgroundColor: 'white',
      },
      indicatorStyle: {
        backgroundColor: 'transparent',
      },
    },
  },
);
