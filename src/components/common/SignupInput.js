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
    />
  );
};

SignupInput.propTypes = {
  value: PropTypes.bool.isRequired,
  reference: PropTypes.func.isRequired,
  isPassword: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  keyboardType: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
  returnKeyType: PropTypes.string.isRequired,
};


export { SignupInput };
