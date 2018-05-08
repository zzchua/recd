import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ListItem, Button } from 'react-native-elements';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { getUserList } from '../database/DatabaseUtils';
import { sendRecd } from '../actions/RecdModalActions';

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
  }

  componentWillMount() {
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
      </View>
    );
  }
}

SendRecdScreen.propTypes = {
  currentUid: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    state: PropTypes.shape().isRequired,
  }).isRequired,
  sendRecd: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    currentUid: state.auth.uid,
  };
};

const mapDispatchToProps = {
  sendRecd,
};

export default connect(mapStateToProps, mapDispatchToProps)(SendRecdScreen);