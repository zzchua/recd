import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextRegular } from '../common';
import { ColorScheme } from '../../styles/constants';

const style = { fontSize: 20, color: ColorScheme.black };

class TextH1 extends Component {
  render() {
    return (
      <TextRegular style={style}>{this.props.children}</TextRegular>
    );
  }
}

TextH1.propTypes = {
  children: PropTypes.string.isRequired,
};

export { TextH1 };
