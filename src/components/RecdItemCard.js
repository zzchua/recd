/**
 * This component renders a Recommendation card in the feed
 */

import React, { Component } from 'react';
import { Avatar } from 'react-native-elements';
import { TouchableNativeFeedback, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import { TextH2, TextH3 } from '../components/common';


const styles = StyleSheet.create({
  senderBox: {},
});

class RecdItemCard extends Component {
  render() {
    const data = this.props.itemData;
    return (
      <TouchableNativeFeedback onPress={() => { this.props.onPress(); }}>
        <View>
          <View>
            <Avatar
              size='small'
              rounded
              source={{ uri: data.senderPhotoUrl }}
              onPress={() => console.log(data.senderPhotoUrl)}
              activeOpacity={0.7}
            />
            <TextH3>{data.senderDisplayName}</TextH3>
          </View>
          <View>
            <TextH2>{data.recdItem.title}</TextH2>
            <TextH3>{data.recdItem.artists[0]}</TextH3>
          </View>
        </View>
      </TouchableNativeFeedback>
    );
  }
}

RecdItemCard.propTypes = {
  onPress: PropTypes.func,
  itemData: PropTypes.shape({
    senderUid: PropTypes.string.isRequired,
    senderPhotoUrl: PropTypes.string.isRequired,
    senderDisplayName: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.object.isRequired,
    type: PropTypes.string,
    recdItem: PropTypes.shape({
      uri: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      playUrl: PropTypes.string.isRequired,
      artists: PropTypes.array.isRequired,
      imageUrls: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

RecdItemCard.defaultProps = {
  onPress: () => {},
};

export default RecdItemCard;
