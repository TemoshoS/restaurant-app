import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';


const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false;

  useEffect(() => {
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
    setLoading(true);

    signOut(auth)
      .then(() => {
        setLoading(false);
        navigation.navigate('Welcome');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Logout error:', error);
      });
  };

  const navigateToPastReservations = () => {
    navigation.navigate('reservation');
  };

  const navigateToEditProfile = () => {
    navigation.navigate('editProfile');
  }

  const adminOrders = () => {
    navigation.navigate('dashboard');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{currentUser ? currentUser : 'Guest'}</Text>
          {user && <Text style={styles.profileEmail}>Email: {user.email}</Text>}
        </View>

        <TouchableOpacity onPress={navigateToEditProfile}>
          <Text style={styles.editProfileButton}>Edit Profile</Text>
        </TouchableOpacity>

        {loading && <ActivityIndicator size="small" color="#0000ff" />}

        {isAdmin ? (
          <TouchableOpacity onPress={adminOrders}>
            <Text style={styles.logoutText}>Dashboard</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={navigateToPastReservations}>
            <Text style={styles.logoutText}>View Reservations</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onLogout} disabled={loading}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00bcd4',
  },
  card: {
    width: 300,
    padding: 20,
    borderRadius: 3,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileInfo: {
    marginLeft: 20,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
  },
  profileBio: {
    fontSize: 14,
    color: '#5A5A5A',
    marginTop: 5,
  },
  editProfileButton: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginVertical: 10,
  },
  badgesCard: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 3,
    backgroundColor: '#00bcd4',
    color: '#fff',
    width: 280,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    position: 'absolute',
    bottom: 10,
  },
  badgeIcon: {
    fontSize: 16,
    margin: 0,
    opacity: 0.6,
    marginRight: 6,
  },
  logoutText: {
    color: 'blue',
    fontSize: 16,
    textDecorationLine: 'underline',
    marginVertical: 5,
  },
});

export default ProfileScreen;
