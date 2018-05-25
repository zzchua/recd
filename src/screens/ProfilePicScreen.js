import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, PixelRatio, Image, Button } from 'react-native';
import PropTypes from 'prop-types';
import { ImagePicker } from 'expo';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',
  },
});

class ProfilePicScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: this.props.navigation.state.params.userInfo,
      userImage: null,
    };

    this.moveToUsernameScreen = this.moveToUsernameScreen.bind(this);
    this.pickProfilePic = this.pickProfilePic.bind(this);
  }

  async pickProfilePic() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [3, 3],
      quality: 0.5,
    });
    if (!result.cancelled) {
      this.setState({ userImage: result.uri });
    }
  }

  moveToUsernameScreen() {
    const {
      userInfo,
      userImage,
    } = this.state;

    if (userImage != null) {
      userInfo.userImage = userImage;
      this.props.navigation.navigate('Username', {
        userInfo,
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Choose your Profile Picture</Text>
        <TouchableOpacity onPress={this.pickProfilePic}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: this.state.userImage }} style={styles.imageContainer} />
          </View>
        </TouchableOpacity>
        <Button
          title='Next'
          onPress={this.moveToUsernameScreen}
        />
      </View>
    );
  }
}

ProfilePicScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape().isRequired,
  }).isRequired,
};

export default ProfilePicScreen;
