import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'react-native-elements';

const SignupInput = ({
  value,
  reference,
  isPassword,
  placeholder,
  keyboardType,
  onChangeText,
  errorMessage,
  returnKeyType,
  label,
}) => {
  return (
    <Input
      ref={reference}
      value={value}
      placeholder={placeholder}
      blurOnSubmit={isPassword}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      errorMessage={errorMessage}
      secureTextEntry={isPassword}
      returnKeyType={returnKeyType}
      autoFocus={false}
      autoCorrect={false}
      autoCapitalize='none'
      keyboardAppearance='light'
      inputStyle={{ marginLeft: 10 }}
      containerStyle={{ borderBottomColor: 'rgba(0, 0, 0, 0.38)' }}
      label={label}
    />
  );
};

SignupInput.propTypes = {
  value: PropTypes.string.isRequired,
  reference: PropTypes.func,
  isPassword: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  keyboardType: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  returnKeyType: PropTypes.string.isRequired,
  label: PropTypes.string,
};

SignupInput.defaultProps = {
  errorMessage: null,
  reference: null,
  label: null,
};


export { SignupInput };
