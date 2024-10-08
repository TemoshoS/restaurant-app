import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants } from '../redux/actions/restaurantActions'; // Assuming this action fetches restaurants from Firestore
import Ionicons from 'react-native-vector-icons/Ionicons';

const RestaurantScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const { restaurants, isAdmin } = useSelector((state) => ({
    restaurants: state.restaurant.restaurants,
    isAdmin: state.user.isAdmin,
  }));

  useEffect(() => {
    dispatch(fetchRestaurants()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.restName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants([]);
    }
  }, [searchTerm, restaurants]);

  const handleLike = (restaurantId) => {
    // Handle the logic for liking a restaurant
    console.log('Liked restaurant with ID:', restaurantId);
  };

  const handleUpdate = (restaurantId) => {
    // Handle updating restaurant info
    console.log('Update restaurant with ID:', restaurantId);
  };

  const handleDelete = (restaurantId) => {
    // Handle deleting a restaurant
    console.log('Delete restaurant with ID:', restaurantId);
  };

  const renderRestaurantItem = ({ item }) => {
    if (!item.restName || !item.restImage) {
      // Skip rendering if important data is missing
      return null;
    }

    return (
      <View style={styles.restaurantItem}>
        <TouchableOpacity onPress={() => navigation.navigate('Restaurant info', { restaurant: item })}>
          <Image source={{ uri: item.restImage }} style={styles.restaurantImage} />
        </TouchableOpacity>
        <View style={styles.restaurantInfo}>
          <Text style={styles.restaurantName}>{item.restName}</Text>
          <Text style={styles.restaurantLocation}>{item.restLocation}</Text>
          <View style={styles.ratingsContainer}>
            <Text style={styles.restaurantRatings}>{item.ratings}</Text>
            {/* Additional rendering of stars or ratings */}
          </View>
        </View>
        {!isAdmin && (
          <TouchableOpacity style={styles.heartButton} onPress={() => handleLike(item.id)}>
            <Ionicons name="heart" size={28} color="#FF6347" />
          </TouchableOpacity>
        )}
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
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20C997" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {filteredRestaurants.length === 0 && restaurants.length === 0 ? (
        <Text style={styles.noRestaurantsText}>No restaurants available.</Text>
      ) : (
        <FlatList
          contentContainerStyle={styles.flatListContent}
          data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderRestaurantItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  restaurantItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  restaurantInfo: {
    padding: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantLocation: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  restaurantRatings: {
    fontSize: 14,
    color: '#FFD700',
    marginRight: 5,
  },
  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  updateButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginLeft: 10,
  },
  noRestaurantsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RestaurantScreen;
