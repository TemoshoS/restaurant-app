import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity ,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const auth = getAuth();
   

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.displayName);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const onLogout = () => {
    const auth = getAuth();
    signOut(auth)
    .then(()=>{

      setTimeout(()=>{
      Alert.alert('Logout Successful', 'You have been logged out.',[
        {text: 'OK', onPress: ()=> console.log('Ok Pressed')},
      ]);

    },100);
      
    })
    .catch((error)=>{
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

    })
  };

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Text style={styles.greetingText}>
          Welcome, {currentUser ? currentUser : 'Guest'}
        </Text>
      </View>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default ProfileScreen;
