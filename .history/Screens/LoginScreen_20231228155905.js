import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../actions/authActions';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = async () => {
    setEmailError(null);
    setPasswordError(null);
    setLoginError(null);
    setEmailError(null);

    if (!email || !password) {
      if (!email) setEmailError('Email is required');
      if (!password) setPasswordError('Password is required');
      return;
    }

    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;

      if (user) {
        dispatch(loginSuccess(user));
        navigation.navigate('Restaurants');
      } else {
        setLoginError('User does not exist.');
      }
    } catch (error) {

      if (error.code === 'auth/user-not-found') {
        setLoginError('User does not exist.');
      } else if (error.code === 'auth/wrong-password') {
        setLoginError('Incorrect password.');
      }
      else {
        setLoginError('Please enter valid email and password');
      }
    }

    console.log('handleLogin function called');
  };



  return (
    <View style={styles.container}>
      <Icon name="user" size={60} color="#ccc" style={styles.userIcon} />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? 'eye-slash' : 'eye'} size={20} color="#ccc" />
        </TouchableOpacity>
      </View>


      {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}
      {loginError && <Text style={styles.errorText}>{loginError}</Text>}



      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginTxt}>Login</Text>
      </TouchableOpacity>



      <View style={styles.newAccount}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.createTxt}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('login')}>
          <Text style={styles.forgotTxt}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  userIcon: {
    width: 90,
    height: 90,
    marginBottom: 90,
    borderWidth: 2,
    borderRadius: 45,
    borderColor: '#ccc',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
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
  errorText: {
    color: '#e41c38',
  },
  loginBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 25,
    marginTop: 20,
    width: '80%',
    marginBottom: 50,
  },
  loginTxt: {
    color: 'white',
    textAlign: 'center',
  },
  createBtn: {
    borderWidth: 2,
    borderColor: '#ccc'
  },
  createTxt: {
    marginRight: 85,
    color: 'gray',
    fontFamily: 'Single Day',
  },

  forgotBtn: {
    marginTop: 10,
  },
  forgotTxt: {
    color: '#72A0C1',
    // textDecorationLine: 'underline',
    fontSize: 16,
    
  },
  showPasswordButton: {
    position: 'absolute',
    right: 20,

  },
  newAccount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  }

});

export default LoginScreen;

