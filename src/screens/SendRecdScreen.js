import React, { Component } from 'react';
import { Alert, ActivityIndicator, View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, Button } from 'react-native-elements';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getUserList } from '../database/DatabaseUtils';
import { sendRecd, resetState } from '../actions/RecdModalActions';

// TODO:
// 1. Render friends faster
// 2. Consider using FlatList, render on demand?

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    flex: 5,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class SendRecdScreen extends Component {
  static navigationOptions = {
    title: 'Send',
    tabBarVisible: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      selectedUsers: new Set(),
    };
    this.addRemoveUser = this.addRemoveUser.bind(this);
    this.sendRecdToUsers = this.sendRecdToUsers.bind(this);
    this.renderLoadingSuccessFailure = this.renderLoadingSuccessFailure.bind(this);
    this.quitAndCleanUpRecdModal = this.quitAndCleanUpRecdModal.bind(this);
  }

  componentDidMount() {
    getUserList().then((querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((userDoc) => {
        const user = {
          uid: userDoc.id,
          firstname: userDoc.get('firstname'),
          lastname: userDoc.get('lastname'),
          username: userDoc.get('username'),
          email: userDoc.get('email'),
          photo: userDoc.get('photo'),
        };
        userList.push(user);
      });
      this.setState({ userList });
    }).catch((error) => {
      // TODO: Dispatch error
    });
  }

  componentDidUpdate() {
    if (this.props.recdSent || this.props.recdSentFailure) {
      this.showConfirmationAlert();
    }
  }

  showConfirmationAlert() {
    const confirm =
      this.props.recdSentFailure ? 'Error sending rec\'d' : 'Rec\'d sent successfully!';
    Alert.alert(
      confirm,
      '',
      [{ text: 'Ok', onPress: this.quitAndCleanUpRecdModal }],
      { cancelable: false },
    );
  }

  quitAndCleanUpRecdModal() {
    // This will cause the component to unmount
    this.props.navigation.popToTop();
    this.props.resetState();
  }

  addRemoveUser(uid) {
    const updatedSet = new Set(this.state.selectedUsers);
    if (updatedSet.has(uid)) {
      // remove the index:
      updatedSet.delete(uid);
    } else {
      updatedSet.add(uid);
    }
    this.setState({ selectedUsers: updatedSet });
  }

  sendRecdToUsers() {
    this.props.sendRecd(
      this.props.currentUid,
      this.state.selectedUsers,
      this.props.navigation.state.params.selectedTrack,
    );
  }

  renderLoadingSuccessFailure() {
    if (this.props.recdSentLoading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size='large' />
        </View>
      );
    }
    return null;
  }

  renderUserList() {
    return this.state.userList.map((user) => {
      const name =
        `check-box${this.state.selectedUsers.has(user.uid) ? '' : '-outline-blank'}`;
      return (
        <ListItem
          key={user.uid}
          title={`${user.firstname} ${user.lastname}`}
          subtitle={user.username}
          leftAvatar={{ source: { uri: user.photo } }}
          rightIcon={
            <MaterialIcons
              name={name}
              size={32}
              onPress={() => { this.addRemoveUser(user.uid); }}
            />}
        />
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.listContainer}>
          <ScrollView>
            {this.renderUserList()}
          </ScrollView>
        </View>
        <View>
          <Button
            icon={<FontAwesome name='send-o' style={styles.actionButtonIcon} />}
            title='Send'
            disabled={this.state.selectedUsers.size === 0}
            onPress={this.sendRecdToUsers}
          />
        </View>
        {this.renderLoadingSuccessFailure()}
      </View>
    );
  }
}

SendRecdScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.shape().isRequired,
    popToTop: PropTypes.func.isRequired,
  }).isRequired,
  sendRecd: PropTypes.func.isRequired,
  resetState: PropTypes.func.isRequired,
  recdSent: PropTypes.bool.isRequired,
  recdSentFailure: PropTypes.bool.isRequired,
  recdSentLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  return {
    currentUid: state.auth.uid,
    recdSent: state.recdModal.recdSent,
    recdSentFailure: state.recdModal.recdSentFailure,
    recdSentLoading: state.recdModal.recdSentLoading,
  };
};

const mapDispatchToProps = {
  sendRecd,
  resetState,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendRecdScreen);