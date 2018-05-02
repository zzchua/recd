import React, { Component } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import PropTypes from 'prop-types';
import { SignupInput } from '../components/common';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'gray',
    width: 400,
    borderRadius: 10,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class UsernameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.navigation.state.params,
      username: '',
      isUsernameValid: true,
    };

    this.moveToProfilePicScreen = this.moveToProfilePicScreen.bind(this);
  }

  moveToProfilePicScreen() {
    const {
      userInfo,
      username,
      isUsernameValid,
    } = this.state;

    this.setState({
      isUsernameValid: this.validateUsername(username) || this.usernameInput.shake(),
    });

    if (isUsernameValid && username.length >= 5) {
      // TODO: Move to next screen
    }
  }

  validateUsername(username) {
    // TODO: Need to check with firebase for existing username
    return username.length >= 5;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Choose a username</Text>

        <View style={styles.formContainer}>
          <SignupInput
            reference={(input) => { this.usernameInput = input; }}
            value={this.state.username}
            isPassword={false}
            placeholder='Username'
            keyboardType='default'
            onChangeText={username => this.setState({ username })}
            errorMessage={this.state.isUsernameValid ? null : 'Please enter a valid first name'}
            returnKeyType='done'
          />
          <Button
            title='Next'
            onPress={this.moveToProfilePicScreen}
          />
        </View>
      </View>
    );
  }
}

UsernameScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape().isRequired,
  }).isRequired,
};

export default UsernameScreen;
