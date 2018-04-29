import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class NotificationScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Notifications',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>View notifications here</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
