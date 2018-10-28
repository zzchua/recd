import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default class ImmersiveItemScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>This is an immersive item.</Text>
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
