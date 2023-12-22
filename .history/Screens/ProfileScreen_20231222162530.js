import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Card, Input, Button } from 'react-native-elements';

const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
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
      <Card containerStyle={styles.card}>
        <View style={styles.user}>
          <Text style={styles.greetingText}>
            Welcome, {currentUser ? currentUser : 'Guest'}
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
      </Card>
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
  card: {
    width: '80%',
    backgroundColor: '#125127',
    padding: 20,
    borderRadius: 10,
  },
  user: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginVertical: 5,
    color: 'white',
  },
});

export default ProfileScreen;
