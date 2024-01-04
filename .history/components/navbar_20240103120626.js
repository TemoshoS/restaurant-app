import React,{useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';


const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);

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

  return (
    <View style={styles.container}>
      <View style={styles.user}>
      <View>
        <Text style={styles.greetingText}>
          Good {getCurrentTimeOfDay()},
        </Text>
        </View>
        <View style={styles.userRow}>
          <Icon name="user" size={20} color="#ccc" /> 
          <Text style={styles.userText}>{currentUser}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ccc',
    fontFamily: 'Roboto Slab',
  },
  userRow: {
    
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  userText: {
    
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ccc',
  },
});

export default Navbar;
