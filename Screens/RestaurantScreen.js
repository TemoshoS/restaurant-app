import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { fetchRestaurants } from '../actions/restaurant';
import Navbar from '../components/navbar';
import Search from '../components/search';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../config/firebase';
import { auth } from '../config/firebase'; 
import { updateDoc, doc, getDoc,getDocs, addDoc, collection } from 'firebase/firestore';


const RestaurantScreen = ({ restaurants, fetchRestaurants, navigation }) => {
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([]);
  const [likes, setLikes] = useState({});
  const user = auth.currentUser;
  const userId = user ? user.uid : null;

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = restaurants.filter((restaurant) =>
      restaurant.restName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  const handleLike = async (restaurantId) => {
    try {
      // Find the restaurant document in the Firestore collection
      const restaurantRef = doc(db, 'restaurants', restaurantId);
  
      // Get the current ratings of the restaurant
      const restaurantSnapshot = await getDoc(restaurantRef);
      const currentRatings = restaurantSnapshot.data().ratings || 0;
  
      // Increment the ratings when a user likes the restaurant
      const updatedRatings = currentRatings + 0.5;
  
      // Update the ratings in the Firestore document
      await updateDoc(restaurantRef, { ratings: updatedRatings });
  
      // Check if the restaurant exists in the favoriteRestaurants collection
      const favouriteRestaurantRef = collection(db, 'favouriteRestaurants');
      const querySnapshot = await getDocs(favouriteRestaurantRef);
      const likedRestaurant = querySnapshot.docs.find(
        (doc) => doc.data().id === restaurantId
      );
  
      if (likedRestaurant) {
        // Update the ratings in the favoriteRestaurants collection
        const likedRestaurantRef = doc(db, 'favouriteRestaurants', likedRestaurant.id);
        await updateDoc(likedRestaurantRef, { ratings: updatedRatings ,userId: userId,});
      } else {
        // If the restaurant doesn't exist in the favoriteRestaurants collection, add it
        const restaurantSnapshot = await getDoc(restaurantRef);
        const restaurantData = restaurantSnapshot.data();
        const restaurantWithRatings = {
          ...restaurantData,
          id: restaurantId,
          ratings: updatedRatings,
          userId: userId,
        };
  
        await addDoc(favouriteRestaurantRef, restaurantWithRatings);
      }
  
      fetchRestaurants();
    } catch (error) {
      console.error('Error updating ratings:', error);
    }
  };
  
  
 
  return (
    <View style={styles.container}>
      <Navbar />
      <Search onSearch={handleSearch} />
      <FlatList
  data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={styles.restaurantItem}>
      <TouchableOpacity
      onPress={() => navigation.navigate('RestaurantDetailsScreen',{restaurant:item})}
      >
      <Image source={{ uri: item.restImage }} style={styles.restaurantImage} />
      </TouchableOpacity>

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>{item.restName}</Text>
        <Text style={styles.restaurantLocation}>{item.restLocation}</Text>
        <View style={styles.ratingsContainer}>
          {item.ratings <= 20 && (
            <Ionicons name="star" size={20} color="#FFD700" />
          )}
          {item.ratings > 20 && item.ratings <= 40 && (
            <>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
            </>
          )}
            {item.ratings > 40 && item.ratings <= 60 && (
            <>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />

            </>
          )}
            {item.ratings > 60 && item.ratings <= 80 && (
            <>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
            </>
          )}
            {item.ratings > 80 &&  (
            <>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
              <Ionicons name="star" size={20} color="#FFD700" />
            </>
          )}
          <Text style={styles.restaurantRatings}>{item.ratings}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.heartButton} onPress={() => handleLike(item.id)}>
        <Ionicons name="heart" size={30} color="red" />
      </TouchableOpacity>
    </View>
  )}
/>


    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    restaurants: state.restaurants.restaurants,
  };
};

export default connect(mapStateToProps, { fetchRestaurants })(RestaurantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  restaurantImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  restaurantInfo: {
    flex: 1,
    marginLeft: 10,
    marginLeft: 40
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
  },
  restaurantRatings: {
    fontSize: 16,
    marginLeft: 5,
  },
});
