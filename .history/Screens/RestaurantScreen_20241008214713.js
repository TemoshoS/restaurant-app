import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
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
  getDoc,
  getDocs,
  addDoc,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const RestaurantScreen = ({ restaurants, fetchRestaurants, navigation }) => {
  const screenWidth = Dimensions.get('window').width;
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const storage = getStorage();
  const [newRestaurantData, setNewRestaurantData] = useState({
    restName: '',
    restLocation: '',
    ratings: 0,
    restImage: '',
    restInfo: '',
    restPhone: '',
    restWebsite: '',
  });
  const [image, setImage] = useState(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const user = auth.currentUser;
  const userId = user ? user.uid : null;
  const isAdmin = user ? user.email === 'kagiso@admin.co' : false;

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
        const likedRestaurantRef = doc(
          db,
          'favouriteRestaurants',
          likedRestaurant.id
        );
        const likedRestaurantSnapshot = await getDoc(likedRestaurantRef);
        const currentRatings = likedRestaurantSnapshot.data().ratings || 0;
        const updatedRatings = currentRatings + 0.5;

        await updateDoc(likedRestaurantRef, {
          ratings: updatedRatings,
          userId: userId,
        });
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
      const { restImage, ...updatedRestaurant } = selectedRestaurant;
      const restaurantRef = doc(db, 'restaurants', selectedRestaurant.id);

      await updateDoc(restaurantRef, updatedRestaurant);
      fetchRestaurants();
      toggleUpdateModal();
    } catch (error) {
      console.error('Error updating restaurant:', error);
    }
  };

  const handleDelete = async (restaurantId) => {
    try {
      const wantDelete = window.confirm('Are you sure you want to delete this restaurant?');

      if (wantDelete) {
        const restaurantRef = doc(db, 'restaurants', restaurantId);
        await deleteDoc(restaurantRef);
        fetchRestaurants();
      }
    } catch (error) {
      console.error('Error deleting restaurant:', error);
    }
  };

  const handleAdd = async () => {
    try {
      if (!image) {
        alert('Please select an image.');
        return;
      }

      if (!newRestaurantData.restName || !newRestaurantData.restLocation || !newRestaurantData.restInfo || !newRestaurantData.restPhone || !newRestaurantData.restWebsite) {
        alert('Please fill in all required fields.');
        return;
      }

      const restaurantsCollectionRef = collection(db, 'restaurants');

      const imageRef = ref(storage, `restaurantImages/${newRestaurantData.restName}`);
      await uploadBytes(imageRef, image);

      const imageUrl = await getDownloadURL(imageRef);
      const newRestaurantRef = await addDoc(restaurantsCollectionRef, {
        ...newRestaurantData,
        restImage: imageUrl,
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
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <FontAwesome style={styles.circle} name="circle" size={700} color="#FFD700" />
      </View>
      <Navbar />
      <Search onSearch={handleSearch} />
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.restaurantItem]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Restaurant info', { restaurant: item })}
            >
              <Image source={{ uri: item.restImage }} style={styles.restaurantImage} />
            </TouchableOpacity>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.restName}</Text>
              <Text style={styles.restaurantLocation}>{item.restLocation}</Text>
              <View style={styles.ratingsContainer}>
                <Ionicons name="star" size={12} color="gold" />
                <Text style={styles.restaurantRatings}>{item.ratings}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.heartButton} onPress={() => handleLike(item.id)}>
              <Ionicons name="heart" size={28} color="#FF6347" />
            </TouchableOpacity>
          </View>
        )}
      />
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={toggleModal}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
      {/* Modal for Adding a New Restaurant */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        useNativeDriver={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Restaurant</Text>
            {image && <Image source={{ uri: image }} style={{ width: 230, height: 200 }} />}
            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
              <Text style={styles.modalButtonText}>Upload Image</Text>
            </TouchableOpacity>
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
            <TextInput
              style={styles.input}
              placeholder="Description"
              onChangeText={(text) => handleInputChange('restInfo', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              onChangeText={(text) => handleInputChange('restPhone', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Website"
              onChangeText={(text) => handleInputChange('restWebsite', text)}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleAdd}>
              <Text style={styles.submitButtonText}>Add Restaurant</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Updating Restaurant */}
      <Modal
        isVisible={isUpdateModalVisible}
        onBackdropPress={toggleUpdateModal}
        style={styles.modal}
        useNativeDriver={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Restaurant</Text>
            {selectedRestaurant && (
              <>
                <TextInput
                  style={styles.input}
                  value={selectedRestaurant.restName}
                  onChangeText={(text) => handleUpdateInputChange('restName', text)}
                />
                <TextInput
                  style={styles.input}
                  value={selectedRestaurant.restLocation}
                  onChangeText={(text) => handleUpdateInputChange('restLocation', text)}
                />
                <TextInput
                  style={styles.input}
                  value={selectedRestaurant.restInfo}
                  onChangeText={(text) => handleUpdateInputChange('restInfo', text)}
                />
                <TextInput
                  style={styles.input}
                  value={selectedRestaurant.restPhone}
                  keyboardType="phone-pad"
                  onChangeText={(text) => handleUpdateInputChange('restPhone', text)}
                />
                <TextInput
                  style={styles.input}
                  value={selectedRestaurant.restWebsite}
                  onChangeText={(text) => handleUpdateInputChange('restWebsite', text)}
                />
                <TouchableOpacity style={styles.submitButton} onPress={handleUpdateRestaurant}>
                  <Text style={styles.submitButtonText}>Update Restaurant</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleUpdateModal}>
                  <Text style={styles.cancelButton}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    marginVertical: 10,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
    alignSelf: 'center',
    overflow: 'hidden',
  },
  restaurantImage: {
    width: 100,
    height: 80,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRatings: {
    fontSize: 14,
    marginLeft: 5,
    color: '#ffcc00',
  },
  heartButton: {
    marginLeft: 'auto',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    elevation: 2,
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#FF6347',
    borderRadius: 30,
    padding: 15,
    elevation: 5,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  modalContent: {
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '100%',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#FF6347',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelButton: {
    color: '#FF6347',
    marginTop: 10,
  },
});

const mapStateToProps = (state) => ({
  restaurants: state.restaurants.restaurants,
});

const mapDispatchToProps = {
  fetchRestaurants,
};

export default connect(mapStateToProps, mapDispatchToProps)(RestaurantScreen);
