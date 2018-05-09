import React, { Component } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Linking,
  Text,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RecdActionButton from '../components/RecdActionButton';
import { getSpotifyAccessToken, retrieveRecdItems } from '../actions/FeedActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
});


class FeedScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.props.retrieveRecdItems(this.props.uid);
    this.props.getSpotifyAccessToken();
  }

  renderFeedList() {
    if (!this.props.loading) {
      return (
        <FlatList
          data={this.props.feedList}
          renderItem={({ item }) => {
            return this.renderFeedItem(item);
          }}
          keyExtractor={item => item.id}
        />
      );
    }
    return null;
  }

  renderFeedItem(item) {
    return (
      <TouchableNativeFeedback
        onPress={() => { Linking.openURL(item.data.recdItem.playUrl); }}
      >
        <Card>
          <Text>{item.data.recdItem.title}</Text>
          <Text>{item.data.recdItem.artists[0]}</Text>
          <Text>{item.data.message}</Text>
          <Text>{item.data.fromUser}</Text>
        </Card>
      </TouchableNativeFeedback>
    );
  }

  renderLoading() {
    if (this.props.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return null;
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderLoading()}
        {this.renderFeedList()}
        <RecdActionButton navigation={this.props.navigation} />
      </View>
    );
  }
}

FeedScreen.propTypes = {
  loading: PropTypes.bool.isRequired,
  feedList: PropTypes.arrayOf(PropTypes.object).isRequired,
  uid: PropTypes.string.isRequired,
  getSpotifyAccessToken: PropTypes.func.isRequired,
  retrieveRecdItems: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    feedList: state.feed.feedList,
    loading: state.feed.loading,
  };
};

const mapDispatchToProps = {
  getSpotifyAccessToken,
  retrieveRecdItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen);
