import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import ActionButton from 'react-native-action-button';
import PropTypes from 'prop-types';
import { FontAwesome, Entypo } from '@expo/vector-icons';
import { showRecdModal } from '../actions/FeedActions';

const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
});

class RecdActionButton extends Component {
  render() {
    return (
      <ActionButton size={40} degrees={135} buttonColor='rgba(231,76,60,1)'>
        <ActionButton.Item size={50} buttonColor='#9b59b6' title="Send a Rec'd" onPress={this.props.showRecdModal}>
          <FontAwesome name='send-o' style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item size={50} buttonColor='#3498db' title="Request a Rec'd" onPress={() => { console.log('request a rec!'); }}>
          <Entypo name='chat' style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    );
  }
}

const mapDispatchToProps = {
  showRecdModal,
};

RecdActionButton.propTypes = {
  showRecdModal: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(RecdActionButton);
