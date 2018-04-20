import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class FeedScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Feed',
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the feed</Text>
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
