import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchFavouriteRestaurants } from '../actions/favoriteRestaurantActions';
import { StyleSheet, Text, View, Image, ScrollView,ImageBackground } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const FavoriteRestaurantScreen = ({ favRestaurants, fetchFavouriteRestaurants }) => {
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    fetchFavouriteRestaurants();

    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserID(user.uid);
      } else {
        setCurrentUserID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredRestaurants = favRestaurants
    .filter((restaurant) => restaurant.ratings > 10 && restaurant.userId === currentUserID)
    .sort((a, b) => b.ratings - a.ratings);

  return (
    <ImageBackground source={require('../assets/food.jpg')} style={styles.backgroundImage}>
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <Text style={styles.header}>My Favorite Restaurants</Text>
      {filteredRestaurants.length === 0 ? (
        <Text style={styles.emptyMessage}>No favorite restaurants to display.</Text>
      ) : (
        filteredRestaurants.map((restaurant) => (
          <View key={restaurant.id} style={styles.restaurantCard}>
            <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />
            <Text style={styles.restaurantName}>{restaurant.restName}</Text>
            <Text style={styles.restaurantRating}>Rating: {restaurant.ratings}</Text>
          </View>
        ))
      )}
    </ScrollView>
    </ImageBackground>
  );
};

const mapStateToProps = (state) => ({
  favRestaurants: state.favoriteRestaurants.favRestaurants,
});

export default connect(mapStateToProps, { fetchFavouriteRestaurants })(FavoriteRestaurantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginVertical: 10,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  restaurantRating: {
    fontSize: 16,
    color: 'green',
    fontFamily: 'Rubik Doodle Shadow'
  },
  emptyMessage: {
    fontSize: 18,
    color: '#F3EEEA',
    textAlign: 'center',
    marginTop: 20,
  },
});
