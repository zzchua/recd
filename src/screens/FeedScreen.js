import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, TouchableHighlight, StyleSheet, Text } from 'react-native';
import PropTypes from 'prop-types';
import RecdActionButton from '../components/RecdActionButton';
import { hideRecdModal } from '../actions/FeedActions';

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

  render() {
    return (
      <View style={styles.container}>
        <Text>This is the feed</Text>
        <RecdActionButton />
        <Modal
          animationType='slide'
          transparent={false}
          visible={this.props.recdModalVisible}
          onRequestClose={this.props.hideRecdModal}
        >
          <View style={{ marginTop: 22 }}>
            <View>
              <Text>Hello World!</Text>
              <TouchableHighlight onPress={this.props.hideRecdModal}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

FeedScreen.propTypes = {
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


export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen);
