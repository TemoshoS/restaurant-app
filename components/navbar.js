import React,{useState, useEffect} from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const goToHome = useNavigation();

  useEffect(()=>{
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user)=>{
      if (user) {
        setCurrentUser(user.displayName);
        
      } else {
        setCurrentUser(null);
        
      }
    });

    return()=> unsubscribe();
  },[]);

  const getCurrentTimeOfDay = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  };


  const onLogout = () =>{
    const auth = getAuth();

    signOut(auth)
    .then(()=>{

      Alert.alert('Logout Successful', 'You have been logged out.',[
        {text: 'OK', onPress: ()=> console.log('Ok Pressed')},
      ]);

      
    goToHome.navigate('Login');
    })
    .catch((error)=>{
      console.error('Logout error:', error);
      Alert.alert('Logout Error', 'An error occurred while logging out.', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);

    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Text style={styles.greetingText}>
          Good {getCurrentTimeOfDay()},
        </Text>
        <View style={styles.userRow}>
          <Icon name="user" size={20} color="#fff" /> 
          <Text style={styles.userText}>{currentUser}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={onLogout}>
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 100
  },
  userText: {
    marginLeft: 10, 
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});

export default Navbar;
