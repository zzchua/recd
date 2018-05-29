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

class FullnameScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.navigation.state.params.userInfo,
      userFirstName: '',
      userLastName: '',
      isFirstNameValid: true,
    };

    this.moveToProfilePicScreen = this.moveToProfilePicScreen.bind(this);
  }

  moveToProfilePicScreen() {
    const { userInfo } = this.state;
    const isFirstNameValid = this.state.userFirstName.trim().length > 0;
    if (!isFirstNameValid) { this.firstNameInput.shake(); }

    if (isFirstNameValid) {
      userInfo.userFirstName = this.state.userFirstName;
      userInfo.userLastName = this.state.userLastName;
      this.props.navigation.navigate('ProfilePic', {
        userInfo,
      });
    }
    this.setState({
      isFirstNameValid,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Tell us your name</Text>

        <View style={styles.formContainer}>
          <SignupInput
            reference={(input) => { this.firstNameInput = input; }}
            value={this.state.userFirstName}
            isPassword={false}
            placeholder='First Name'
            keyboardType='default'
            onChangeText={userFirstName => this.setState({ userFirstName })}
            errorMessage={this.state.isFirstNameValid ? null : 'Please enter a valid first name'}
            returnKeyType='next'
          />
          <SignupInput
            value={this.state.userLastName}
            isPassword={false}
            placeholder='Last Name'
            keyboardType='default'
            onChangeText={userLastName => this.setState({ userLastName })}
            returnKeyType='done'
          />
        </View>
        <Button
          title='Next'
          onPress={this.moveToProfilePicScreen}
        />
      </View>
    );
  }
}

FullnameScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape().isRequired,
  }).isRequired,
};

export default FullnameScreen;
