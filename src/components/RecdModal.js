import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Button, View, StyleSheet, Linking } from 'react-native';
import { Input, ListItem } from 'react-native-elements';
import { hideRecdModal } from '../actions/FeedActions';
import { getSpotifyTracks, clearSearchTrackItems } from '../actions/RecdModalActions';

// TODO: Add styles to this
const styles = StyleSheet.create({
  container: {},
});

class RecdModal extends Component {
  constructor(props) {
    super(props);
    this.state = { searchString: '' };
    this.onSearchStringChange = this.onSearchStringChange.bind(this);
    this.closeModalCleanup = this.closeModalCleanup.bind(this);
  }

  onSearchStringChange(text) {
    this.setState(() => {
      return { searchString: text };
    });
    this.props.getSpotifyTracks(this.props.spotifyAccessToken, text);
  }

  closeModalCleanup() {
    this.setState(() => {
      return { searchString: '' };
    });
    this.props.hideRecdModal();
    this.props.clearSearchTrackItems();
  }

  renderSearchList() {
    return this.props.searchTrackItems.map((track) => {
      return (
        <ListItem
          key={track.id}
          title={track.name}
          subtitle={track.artists[0].name}
          onPress={() => {
            Linking.openURL(track.external_urls.spotify);
          }}
        />
      );
    });
  }

  render() {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.props.recdModalVisible}
        onRequestClose={this.closeModalCleanup}
      >
        <View style={styles.container}>
          <View>
            <Input
              placeholder='Enter an artist, album or song'
              onChangeText={this.onSearchStringChange}
              value={this.state.searchString}
            />
          </View>
          <View>
            {this.renderSearchList()}
          </View>
          <View>
            <Button onPress={this.closeModalCleanup} title='close' />
          </View>
        </View>
      </Modal>
    );
  }
}

RecdModal.propTypes = {
  spotifyAccessToken: PropTypes.string.isRequired,
  recdModalVisible: PropTypes.bool.isRequired,
  hideRecdModal: PropTypes.func.isRequired,
  getSpotifyTracks: PropTypes.func.isRequired,
  searchTrackItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  clearSearchTrackItems: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    spotifyAccessToken: state.feed.spotifyAccessToken,
    recdModalVisible: state.feed.recdModalVisible,
    searchTrackItems: state.recdModal.searchTrackItems,
  };
};

const mapDispatchToProps = {
  hideRecdModal,
  getSpotifyTracks,
  clearSearchTrackItems,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecdModal);
