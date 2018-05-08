import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RecdActionButton from '../components/RecdActionButton';
import { getSpotifyAccessToken } from '../actions/FeedActions';

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
    header: null,
  };

  componentWillMount() {
    this.props.getSpotifyAccessToken();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the feed</Text>
        <RecdActionButton navigation={this.props.navigation} />
      </View>
    );
  }
}

FeedScreen.propTypes = {
  getSpotifyAccessToken: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapDispatchToProps = {
  getSpotifyAccessToken,
};

export default connect(null, mapDispatchToProps)(FeedScreen);
