import React, { Component } from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { TextRegular } from '../common';
import { ColorScheme } from '../../styles/constants';

const style = { fontSize: 20, color: ColorScheme.lblack };

class TextH3 extends Component {
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

TextH3.propTypes = {
  children: PropTypes.string.isRequired,
};

export { TextH3 };
