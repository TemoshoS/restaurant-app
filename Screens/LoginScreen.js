import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../actions/authActions';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState();
  const dispatch = useDispatch();



const handleLogin = async () => {
  try {
    const auth = getAuth(); // Get the Firebase Authentication instance
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // The user has been authenticated successfully
    const user = userCredential.user;
    // Dispatch the user data to Redux
    dispatch(loginSuccess(user));
  } catch (error) {
    // Handle login error (e.g., display an error message)
    console.error('Login error:', error);
  }
};


  return (
    <View>
      <Text>LoginScreen</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
