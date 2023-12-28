import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { registerSuccess } from '../actions/authActions';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


const RegisterScreen = () => {

  const [name, setName] = useState('');
  const [namerr, setNamerr] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [reenterPasswordError, setReenterPasswordError] = useState(null);
  const [userExistsMessage, setUserExistsMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleRegister = async () => {
    // Reset previous validation errors and user exists message
    setNamerr(null);
    setEmailError(null);
    setPasswordError(null);
    setReenterPasswordError(null);
    setUserExistsMessage('');

    // Validate all fields
    if (!name || !email || !password || !reenterPassword) {
      if (!name) setNamerr('Name is required');
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      if (!reenterPassword) setReenterPasswordError('Re-enter password is required');
      return;
    }

    // Password strength validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{7,}$/;
    if (!password.match(passwordRegex)) {
      setPasswordError('Password must contain at least 7 characters, 1 number, 1 uppercase letter, 1 lowercase letter, and 1 special character');
      return;
    }

    if (password !== reenterPassword) {
      setReenterPasswordError('Passwords do not match');
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
        
      });

      dispatch(registerSuccess(user));


      // Reset fields and show success message
      setName('');
      setEmail('');
      setPassword('');
      setReenterPassword('');
      setUserExistsMessage('Account created successfully.');

      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setUserExistsMessage('User with this email already exists.');
      }
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register Screen</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
      />
      {namerr && <Text style={styles.errorText}>{namerr}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
      />
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={!showPassword}
      />
      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Re-enter Password"
        onChangeText={(text) => setReenterPassword(text)}
        secureTextEntry={!showPassword}
      />
      {reenterPasswordError && <Text style={styles.errorText}>{reenterPasswordError}</Text>}

      {userExistsMessage && <Text style={styles.successMessage}>{userExistsMessage}</Text>}

      <View style={styles.passwordStrength}>
        {passwordStrength && <Text>Password Strength: {passwordStrength}</Text>}
      </View>

      <TouchableOpacity style={styles.showPasswordButton} onPress={toggleShowPassword}>
        <Text>{showPassword ? 'Hide Password' : 'Show Password'}</Text>
      </TouchableOpacity>

      <Button title="Register" onPress={handleRegister} />

      <View style={styles.sameRow}><Text>Already have an account? </Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.forgotTxt}>Login</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
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
  errorText: {
    color: 'red',
  },
  successMessage: {
    color: 'green',
  },
  passwordStrength: {
    marginTop: 10,
  },
  showPasswordButton: {
    marginTop: 10,
  },
  forgotTxt: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  sameRow:{
    flexDirection: 'row',
    marginTop: 10,
  }
});

export default RegisterScreen;
