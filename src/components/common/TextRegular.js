import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';

class TextRegular extends Component {
  render() {
    return (
      <Text style={{ fontFamily: 'pt-sans-regular' }}>{this.props.children}</Text>
    );
  }
}

TextRegular.propTypes = {
  children: PropTypes.element.isRequired,
};

export { TextRegular };
