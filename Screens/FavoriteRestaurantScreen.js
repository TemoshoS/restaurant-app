import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchRestaurants } from '../actions/restaurant';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';

const FavoriteRestaurantScreen = ({ restaurants, fetchRestaurants }) => {
  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const filteredRestaurants = restaurants.filter((restaurant) => restaurant.ratings > 20);

  filteredRestaurants.sort((a, b) => b.ratings - a.ratings);

  return (
    <ScrollView style={styles.container}>
      {filteredRestaurants.map((restaurant) => (
        <View key={restaurant.id} style={styles.restaurantCard}>
          <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />
          <Text style={styles.restaurantName}>Name: {restaurant.restName}</Text>
          <Text style={styles.restaurantRating}>Rating: {restaurant.ratings}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({
  restaurants: state.restaurants.restaurants,
});

export default connect(mapStateToProps, { fetchRestaurants })(FavoriteRestaurantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  restaurantCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 16,
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
  },
  restaurantRating: {
    fontSize: 16,
    color: '#888',
  },
});
