import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { TextRegular } from '../common';
import { ColorScheme } from '../../styles/constants';

const style = { fontSize: 50, color: ColorScheme.black };

class TextH2 extends Component {
  render() {
    return (
      <TextRegular>
        <Text style={style}>
          {this.props.children}
        </Text>
      </TextRegular>
    );
  }
}

TextH2.propTypes = {
  children: PropTypes.string.isRequired,
};

export { TextH2 };
