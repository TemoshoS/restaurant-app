import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/authActions';

const ForgotPasswordScreen = () => {
  const dispatch = useDispatch();
  const forgotPasswordLoading = useSelector((state) => state.auth.forgotPasswordLoading);
  const forgotPasswordSuccess = useSelector((state) => state.auth.forgotPasswordSuccess);
  const forgotPasswordError = useSelector((state) => state.auth.forgotPasswordError);

  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    dispatch(forgotPassword(email));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button
        title="Reset Password"
        onPress={handleResetPassword}
        disabled={forgotPasswordLoading}
      />
      {forgotPasswordLoading && <Text style={styles.infoText}>Sending reset email...</Text>}
      {forgotPasswordSuccess && <Text style={styles.successText}>Reset email sent. Check your inbox.</Text>}
      {forgotPasswordError && <Text style={styles.errorText}>Error: {forgotPasswordError.message}</Text>}
    </View>
  );
};

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: isSmallDevice ? 20 : 24,
    marginBottom: isSmallDevice ? 10 : 20,
  },
  input: {
    width: isSmallDevice ? '90%' : '80%',
    marginBottom: 10,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  infoText: {
    color: 'blue',
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
});

export default ForgotPasswordScreen;
