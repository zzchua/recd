import React, { Component } from 'react';
import { View, StyleSheet, Text, AsyncStorage } from 'react-native';
import axios from 'axios';
import RecdActionButton from '../components/RecdActionButton';
import RecdModal from '../components/RecdModal';
import { FIREBASE_BACKEND_API } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


class FeedScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Feed',
  };

  componentDidMount() {
    console.log('Component Did Mount');
    this.getSpotifyAccessToken();
  }

  async getSpotifyAccessToken() {
    let response;
    try {
      response = await axios.get(FIREBASE_BACKEND_API.GET_SPOTIFY_ACCESS_TOKEN_URL);
      console.log(response);
    } catch (error) {
      console.error('ERR: Error retrieving spotify token');
      console.error(error);
    }

    try {
      await AsyncStorage.setItem('spotifyAccessToken', response.data.access_token);
    } catch (error) {
      console.error('ERR: Error storing spotify token');
      console.error(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the feed</Text>
        <RecdActionButton />
        <RecdModal />
      </View>
    );
  }
}

export default FeedScreen;
