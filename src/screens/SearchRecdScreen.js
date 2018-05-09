import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Input, ListItem } from 'react-native-elements';
import { getSpotifyTracks, clearSearchTrackItems } from '../actions/RecdModalActions';


// TODO: Add styles to this
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButtonContainer: {
    flex: 1,
  },
  searchContainer: {
    flex: 4,
  },
});

class SearchRecdScreen extends Component {
  static navigationOptions = {
    title: 'Search',
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.onTrackSelected = this.onTrackSelected.bind(this);
  }

  componentWillUnmount() {
    this.props.clearSearchTrackItems();
  }

  onSearchStringChange(text) {
    this.setState({ searchString: text });
    // Clear search results if there's no search string
    if (text.trim() === '') {
      this.props.clearSearchTrackItems();
    } else {
      this.props.getSpotifyTracks(this.props.spotifyAccessToken, text);
    }
  }

  onTrackSelected(uri, title, artists, imageUrls, playUrl) {
    // Only extract artist name
    const artistNames = artists.map((artist) => {
      return artist.name;
    });
    this.props.navigation.navigate(
      'RecdSend',
      {
        selectedTrack: {
          uri, title, artists: artistNames, imageUrls, playUrl,
        },
      },
    );
  }

  // TODO: Handle display of multiple artists
  renderSearchList() {
    return this.props.searchTrackItems.map((track) => {
      return (
        <ListItem
          key={track.id}
          title={track.name}
          subtitle={track.artists[0].name}
          onPress={() => {
              this.onTrackSelected(
                track.uri,
                track.name,
                track.artists,
                track.album.images,
                track.external_urls.spotify,
              );
            }
          }
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View>
          <Input
            placeholder='Enter an artist, album or song'
            onChangeText={this.onSearchStringChange}
            value={this.state.searchString}
          />
        </View>
        <View style={styles.searchContainer}>
          <ScrollView>
            {this.renderSearchList()}
          </ScrollView>
        </View>
      </View>
    );
  }
}

SearchRecdScreen.propTypes = {
  spotifyAccessToken: PropTypes.string.isRequired,
  getSpotifyTracks: PropTypes.func.isRequired,
  searchTrackItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearSearchTrackItems: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  return {
    spotifyAccessToken: state.feed.spotifyAccessToken,
    searchTrackItems: state.recdModal.searchTrackItems,
  };
};

const mapDispatchToProps = {
  getSpotifyTracks,
  clearSearchTrackItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchRecdScreen);
