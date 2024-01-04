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

const RestaurantScreen = ({ restaurants, fetchRestaurants, navigation }) => {
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

        await updateDoc(likedRestaurantRef, { ratings: updatedRatings, userId: userId, });
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

      // if (!newRestaurantData.restName || !newRestaurantData.restLocation || !newRestaurantData.restInfo || !newRestaurantData.restPhone|| !newRestaurantData.restWebsite) {
      //   alert('Please fill in all required fields.');
      //   return;
      // }
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


        const contentType = "image/jpeg";

        const response = await fetch(result.uri);
        const blob = await response.blob();


        const imageRef = ref(storage, `restaurantImages/${newRestaurantData.restName}`);
        await uploadBytes(imageRef, blob, { contentType });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };


  return (
    <View style={styles.container}>
      <Navbar />
      <Search onSearch={handleSearch} />
      <FlatList
        contentContainerStyle={styles.flatListContent}
        data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Restaurant info', { restaurant: item })}
            >
              <Image source={{ uri: item.restImage }} style={styles.restaurantImage} />
            </TouchableOpacity>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>{item.restName}</Text>
              <Text style={styles.restaurantLocation}>{item.restLocation}</Text>
              <View style={styles.ratingsContainer}>
              <Text style={styles.restaurantRatings}>{item.ratings}</Text>

              {item.ratings < 50  && (
            <>
              <Ionicons name="star" size={12} color="gold" />
              
            </>
          )}
           {item.ratings >= 50 && item.ratings < 75 && (
            <>
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
            </>
          )}
          {item.ratings >= 75 && item.ratings < 100 && (
            <>
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
            </>
          )}
          {item.ratings >= 100 && item.ratings < 150 && (
            <>
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
            </>
          )}
          {item.ratings >= 150 && (
            <>
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
              <Ionicons name="star" size={12} color="gold" />
            </>
          )}
                
                
              </View>
            </View>
            {!isAdmin && (
              <TouchableOpacity style={styles.heartButton} onPress={() => handleLike(item.id)}>
                <Ionicons name="heart" size={28} color="#ccc" />
              </TouchableOpacity>
            )}
            {/* Buttons for Update and Delete */}
            {isAdmin && (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.updateButton} onPress={() => handleUpdate(item.id)}>
                  <Ionicons name="create" size={24} color="#6082B6" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={24} color="#FF003F" />
                </TouchableOpacity>
              </View>
            )}
          </View>
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
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        style={styles.modal}
        useNativeDriver={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Restaurant</Text>
            {/* Image picker button */}

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

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleModal}
            >
              <Icon name="times" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Updating a Restaurant */}
      <Modal
        isVisible={isUpdateModalVisible}
        onBackdropPress={toggleUpdateModal}
        style={styles.modal}
        useNativeDriver={false}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Restaurant</Text>
            {selectedRestaurant && selectedRestaurant.restImage && (
              <Image
                source={{ uri: selectedRestaurant.restImage }}
                style={{ width: 225, height: 200, marginBottom: 10 }}
              />
            )}
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
              style={styles.closeButton}
              onPress={() => setUpdateModalVisible(false)}
            >
              <Icon name="times" size={30} color="#fff" />
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
    backgroundColor: '#fff',
    justifyContent: 'center'
  },

  flatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  restaurantItem: {
    width: Dimensions.get('window').width * 0.8,
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
    alignSelf: 'center', 
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
    color: '#ccc',
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRatings: {
    fontSize: 16,
    marginLeft: 5,
    color: 'black',
    fontFamily: 'Rubik Doodle Shadow'
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
    backgroundColor: '#83764F',
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
    color: '#F3EEEA',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    color: '#F3EEEA',
  },
  modalButton: {
    backgroundColor: '#F3EEEA',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    color: '',
  },
  modalButtonText: {
    color: '#83764F',
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
});
