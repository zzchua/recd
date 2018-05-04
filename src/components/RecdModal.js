import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Modal, Text, Button, View, StyleSheet } from 'react-native';
import { Input } from 'react-native-elements';
import { hideRecdModal } from '../actions/FeedActions';

const styles = StyleSheet.create({
  container: {},
});

class RecdModal extends Component {
  render() {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.props.recdModalVisible}
        onRequestClose={this.props.hideRecdModal}
      >
        <View style={styles.container}>
          <View>
            <Input placeholder='Enter an artist, album or song' />
            <Button onPress={this.props.hideRecdModal} title='close' />
          </View>
        </View>
      </Modal>
    );
  }
}

RecdModal.propTypes = {
  recdModalVisible: PropTypes.bool.isRequired,
  hideRecdModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    recdModalVisible: state.feed.recdModalVisible,
  };
};

const mapDispatchToProps = {
  hideRecdModal,
};

export default connect(mapStateToProps, mapDispatchToProps)(RecdModal);
