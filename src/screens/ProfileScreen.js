import React, { Component } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/AuthActions';
import { Spinner } from '../components/common';

class ProfileScreen extends Component {
  static navigationOptions = {
    tabBarLabel: 'Profile',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.uid === '') {
      this.props.navigation.navigate('Auth');
    }
  }

  renderSignOutButton() {
    if (this.props.loading) {
      return <Spinner />;
    }
    return (
      <Button
        title='Log Out'
        onPress={this.props.logoutUser}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Profile</Text>
        {this.renderSignOutButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

ProfileScreen.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => {
  return {
    uid: state.auth.uid,
    loading: state.auth.loading,
  };
};

const mapDispatchToProps = {
  logoutUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
