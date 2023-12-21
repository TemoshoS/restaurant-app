import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { connect } from 'react-redux';
import { fetchRestaurants } from '../actions/restaurant';
import Navbar from '../components/navbar';
import Search from '../components/search';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../config/firebase';
import {
  updateDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import Animated, { Easing, Value, timing } from 'react-native-reanimated';


const RestaurantScreen = ({ restaurants, fetchRestaurants, navigation }) => {
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [newRestaurantData, setNewRestaurantData] = useState({
    restName: '',
    restLocation: '',
    ratings: 0,
    restImage: '',
    restInfo: '',
    restPhone: '',
    restWebsite: '',
  });
  const heartScale = new Animated.Value(1);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleUpdateModal = () => {
    setUpdateModalVisible(!isUpdateModalVisible);
  };

  const handleInputChange = (field, value) => {
    setNewRestaurantData({
      ...newRestaurantData,
      [field]: value,
    });
  };

  const handleUpdateInputChange = (field, value) => {
    setSelectedRestaurant({
      ...selectedRestaurant,
      [field]: value,
    });
  };

  const handleSearch = (text) => {
    const filtered = restaurants.filter((restaurant) =>
      restaurant.restName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  

  const handleLike = async (restaurantId) => {
    try {
      
      const restaurantRef = doc(db, 'restaurants', restaurantId);
  
      const restaurantSnapshot = await getDoc(restaurantRef);
      const currentRatings = restaurantSnapshot.data().ratings || 0;
  
      
      const updatedRatings = currentRatings + 0.5;
  
      
      await updateDoc(restaurantRef, { ratings: updatedRatings });
  
      
      const favouriteRestaurantRef = collection(db, 'favouriteRestaurants');
      const querySnapshot = await getDocs(favouriteRestaurantRef);
      const likedRestaurant = querySnapshot.docs.find(
        (doc) => doc.data().id === restaurantId
      );
  
      if (likedRestaurant) {
        
        const likedRestaurantRef = doc(db, 'favouriteRestaurants', likedRestaurant.id);
        const likedRestaurantSnapshot = await getDoc(likedRestaurantRef);
        const currentRatings = likedRestaurantSnapshot.data().ratings || 0;
        const updatedRatings = currentRatings + 0.5;

        await updateDoc(likedRestaurantRef, { ratings: updatedRatings ,userId: userId,});
      } else {
        
        const restaurantSnapshot = await getDoc(restaurantRef);
        const restaurantData = restaurantSnapshot.data();
        const restaurantWithRatings = {
          ...restaurantData,
          id: restaurantId,
          ratings: 1,
          userId: userId,
        };
  
        await addDoc(favouriteRestaurantRef, restaurantWithRatings);
      }
      Animated.sequence([
        Animated.timing(heartScale, { toValue: 1.5, duration: 100, easing: Easing.linear }),
        Animated.timing(heartScale, { toValue: 1, duration: 100, easing: Easing.linear }),
      ]).start();
  
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating ratings:', error);
    }
  };
  

  const handleUpdate = (restaurantId) => {
    const selected = restaurants.find((restaurant) => restaurant.id === restaurantId);
    setSelectedRestaurant(selected);
    toggleUpdateModal();
  };

  const handleUpdateRestaurant = async () => {
    try {
      const restaurantRef = doc(db, 'restaurants', selectedRestaurant.id);
      await updateDoc(restaurantRef, selectedRestaurant);
      fetchRestaurants();
      toggleUpdateModal();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      const restaurantRef = doc(db, 'restaurants', restaurantId);
      await deleteDoc(restaurantRef);
      fetchRestaurants();
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const restaurantsCollectionRef = collection(db, 'restaurants');
      const newRestaurantRef = await addDoc(restaurantsCollectionRef, {
        ...newRestaurantData,
      });

      const autoGeneratedId = newRestaurantRef.id;
      await updateDoc(newRestaurantRef, {
        id: autoGeneratedId,
      });

      fetchRestaurants();

      toggleModal();
    } catch (error) {
      console.error('Error adding restaurant:', error);
    }
  };

  const handleImagePick = () => {
    // Configure image picker
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // Open image picker
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Set the picked image to the state
        handleInputChange('restImage', response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
    <Navbar />
    <Search onSearch={handleSearch} />
    <FlatList
      data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Animated.View style={styles.restaurantItem}>
          <TouchableOpacity
            onPress={() => navigation.navigate('RestaurantDetailsScreen', { restaurant: item })}
          >
            <Image source={{ uri: item.restImage }} style={styles.restaurantImage} />
          </TouchableOpacity>
          <View style={styles.restaurantInfo}>
            <Text style={styles.restaurantName}>{item.restName}</Text>
            <Text style={styles.restaurantLocation}>{item.restLocation}</Text>
            <View style={styles.ratingsContainer}>
              {/* Ratings icons */}
              <Ionicons name="star" size={20} color="orange" />
              <Text style={styles.restaurantRatings}>{item.ratings}</Text>
            </View>
          </View>
          {!isAdmin && (
            <TouchableOpacity
              style={styles.heartButton}
              onPress={() => handleLike(item.id)}
              activeOpacity={0.7}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons name="heart" size={30} color="red" />
              </Animated.View>
            </TouchableOpacity>
          )}
            {/* Buttons for Update and Delete */}
            {isAdmin && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(item.id)}>
                  <Ionicons name="create" size={20} color="blue" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>

        )}
      />
      {/* Button to Add New Restaurant */}
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}

      {/* Modal for Adding a New Restaurant */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Restaurant</Text>
            <TextInput
              style={styles.input}
              placeholder="Restaurant Name"
              onChangeText={(text) => handleInputChange('restName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Restaurant Location"
              onChangeText={(text) => handleInputChange('restLocation', text)}
            />

            {/* Image picker button */}
            <TouchableOpacity style={styles.modalButton} onPress={handleImagePick}>
              <Text style={styles.modalButtonText}>Pick Image</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={(text) => handleInputChange('restInfo', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              onChangeText={(text) => handleInputChange('restPhone', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Website"
              onChangeText={(text) => handleInputChange('restWebsite', text)}
            />

            <TouchableOpacity style={styles.modalButton} onPress={handleAdd}>
              <Text style={styles.modalButtonText}>Add Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Updating a Restaurant */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUpdateModalVisible}
        onRequestClose={toggleUpdateModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Restaurant</Text>
            <TextInput
              style={styles.input}
              placeholder="Updated Restaurant Name"
              value={selectedRestaurant ? selectedRestaurant.restName : ''}
              onChangeText={(text) => handleUpdateInputChange('restName', text)}
            />

              <TextInput
              style={styles.input}
              placeholder="Updated Restaurant Location"
              value={selectedRestaurant ? selectedRestaurant.restLocation : ''}
              onChangeText={(text) => handleUpdateInputChange('restLocation', text)}
            />
              <TextInput
              style={styles.input}
              placeholder="Updated Restaurant informatiom"
              value={selectedRestaurant ? selectedRestaurant.restInfo : ''}
              onChangeText={(text) => handleUpdateInputChange('restInfo', text)}
            />
              <TextInput
              style={styles.input}
              placeholder="Updated Restaurant Phone Number"
              value={selectedRestaurant ? selectedRestaurant.restPhone : ''}
              onChangeText={(text) => handleUpdateInputChange('restPhone', text)}
            />

<TextInput
              style={styles.input}
              placeholder="Updated Restaurant website"
              value={selectedRestaurant ? selectedRestaurant.restWebsite : ''}
              onChangeText={(text) => handleUpdateInputChange('restWebsite', text)}
            />
            

            <TouchableOpacity style={styles.modalButton} onPress={handleUpdateRestaurant}>
              <Text style={styles.modalButtonText}>Update Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setUpdateModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    restaurants: state.restaurants.restaurants,
  };
};

const mapDispatchToProps = {
  fetchRestaurants,
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#black',
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    transition: 'background-color 0.3s ease',
  },
  restaurantImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 10,
    marginLeft: 40,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantLocation: {
    fontSize: 16,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRatings: {
    fontSize: 16,
    marginLeft: 5,
    color: 'orange',
  },
  heartButton: {
    marginLeft: 'auto',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
  updateButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 4,
    
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});
