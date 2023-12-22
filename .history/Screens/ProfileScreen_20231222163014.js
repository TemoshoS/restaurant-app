import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false;


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

    setLoading(true);

    signOut(auth)
      .then(() => {
        setLoading(false);

        setTimeout(() => {
          Alert.alert('Logout Successful', 'You have been logged out.', [
            { text: 'OK', onPress: () => console.log('Ok Pressed') },
          ]);
        }, 100);
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Logout error:', error);
        Alert.alert('Logout Error', 'An error occurred while logging out.', [
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
      });
  };

  const navigateToPastReservations = () => {
    navigation.navigate('reservation');
  };

  const adminOrders = () => {
    navigation.navigate('dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Text style={styles.greetingText}>
          Name: {currentUser ? currentUser : 'Guest'}
        </Text>
        user && (
          <Text style={styles.greetingText}>
            Email: {user.email}
          </Text>
      </View>
      <TouchableOpacity onPress={onLogout} disabled={loading}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="small" color="#0000ff" />}
      
      
      {isAdmin ? (
        <TouchableOpacity onPress={adminOrders}>
          <Text style={styles.logoutText}>View Customer Reservations</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={navigateToPastReservations}>
          <Text style={styles.logoutText}>View Reservations</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#83764F',
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
    marginVertical: 5,
  },
});

export default ProfileScreen;
