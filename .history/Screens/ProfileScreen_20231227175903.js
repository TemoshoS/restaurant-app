import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image , ActivityIndicator} from 'react-native';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';



const ProfileScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false;
  const [image, setImage] = useState(null);
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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);


        const contentType = "image/jpeg";

        const response = await fetch(result.uri);
        const blob = await response.blob();


        const imageRef = ref(storage, `restaurantImages/${newMenuItem.menuName}`);
        await uploadBytes(imageRef, blob, { contentType });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
       <View >
      <AntDesign style={styles.circle} name="caretright" size={400} color="#ccc" />
              
          </View>
      <View style={styles.card}>
     
      <View style={styles.imageContainer}>
          <Image
            source={{ uri: image || 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraIconContainer} onPress={pickImage}>
            <Entypo name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
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
    
  },
  imageContainer:{
    position: 'relative',  
  },
  cameraIconContainer:{
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'black',

  },
  card: {
    width: '80%',
    minHeight: '50vh',
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
  circle:{
    marginLeft: -400,
    marginTop: -50,
    position:'absolute'
  
},
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
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
