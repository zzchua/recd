import React, { Component } from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  Text,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RecdActionButton from '../components/RecdActionButton';
import RecdItemCard from '../components/RecdItemCard';
import {
  getSpotifyAccessToken,
  retrieveRecdItems,
  refreshFeed,
} from '../actions/FeedActions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 0 : StatusBar.currentHeight,
  },
  emptyFeedMessageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});


class FeedScreen extends Component {
  static navigationOptions = {
    header: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isFacebookNewUser && prevState.isFacebookNewUser === false) {
      nextProps.navigation.navigate('SecondaryDetailsModal');
      return { isFacebookNewUser: nextProps.isFacebookNewUser };
    }
    return prevState;
  }

  constructor(props) {
    super(props);
    this.state = { isFacebookNewUser: false };
    this.onPullToRefresh = this.onPullToRefresh.bind(this);
  }

  componentDidMount() {
    this.props.retrieveRecdItems(this.props.uid);
    this.props.getSpotifyAccessToken();
  }

  onPullToRefresh() {
    this.props.refreshFeed(this.props.uid);
  }

  renderListEmpty() {
    return (
      <View>
        <Text>Your friends have not sent you any recommendations.</Text>
        <Text>You can pull down to refresh.</Text>
        <Text>Try sending a recommendation to get started!</Text>
      </View>
    );
  }

  renderFeedList() {
    if (!this.props.loading) {
      return (
        // item: id, data
        <FlatList
          data={this.props.feedList}
          renderItem={({ item }) => {
            return this.renderFeedItem(item);
          }}
          keyExtractor={item => item.id}
          refreshing={this.props.refreshingFeed}
          onRefresh={this.onPullToRefresh}
          ListEmptyComponent={this.renderListEmpty}
          contentContainerStyle={
            this.props.feedList.length === 0 ? styles.emptyFeedMessageContainer : null
          }
        />
      );
    }
    return null;
  }

  renderFeedItem(item) {
    return (
      <RecdItemCard
        itemData={item.data}
        onPress={() => { this.props.navigation.navigate('ImmersiveItem'); }}
      />
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
  isFacebookNewUser: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  refreshingFeed: PropTypes.bool.isRequired,
  feedList: PropTypes.arrayOf(PropTypes.object).isRequired,
  uid: PropTypes.string.isRequired,
  getSpotifyAccessToken: PropTypes.func.isRequired,
  retrieveRecdItems: PropTypes.func.isRequired,
  refreshFeed: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    feedList: state.feed.feedList,
    loading: state.feed.loading,
    refreshingFeed: state.feed.refreshingFeed,
    isFacebookNewUser: state.auth.isFacebookNewUser,
  };
};

const mapDispatchToProps = {
  getSpotifyAccessToken,
  retrieveRecdItems,
  refreshFeed,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen);
