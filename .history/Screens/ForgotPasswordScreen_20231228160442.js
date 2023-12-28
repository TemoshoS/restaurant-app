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
      <View style={styles.passwordContainer}>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      </View>
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
    width: '100%',
    marginBottom: 10,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    color: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  infoText: {
    color: 'blue',
  },
  restBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    marginBottom: 50,
  },
  registerTxt: {
    color: 'white',
    textAlign: 'center',
  },
  successText: {
    color: 'green',
  },
  errorText: {
    color: 'red',
  },
});

export default ForgotPasswordScreen;
