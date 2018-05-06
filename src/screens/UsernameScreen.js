import React, { Component } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { signUpUserWithEmail } from '../actions/AuthActions';
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
      userInfo: this.props.navigation.state.params.userInfo,
      username: '',
      isUsernameValid: true,
    };

    this.signUpWithFirebase = this.signUpWithFirebase.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSignedUp) {
      this.props.navigation.navigate('App');
    }
  }

  signUpWithFirebase() {
    const {
      userInfo,
      username,
      isUsernameValid,
    } = this.state;

    this.setState({
      isUsernameValid: this.validateUsername(username) || this.usernameInput.shake(),
    });

    if (isUsernameValid) {
      // TODO: Move to next screen
      userInfo.username = username;
      this.props.signUpUserWithEmail(userInfo);
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
        </View>
        <Button
          title='Finish'
          onPress={this.signUpWithFirebase}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSignedUp: state.auth.isSignedUp,
  };
};

const mapDispatchToProps = {
  signUpUserWithEmail,
};

UsernameScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape().isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  isSignedUp: PropTypes.bool,
  signUpUserWithEmail: PropTypes.func.isRequired,
};

UsernameScreen.defaultProps = {
  isSignedUp: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsernameScreen);
