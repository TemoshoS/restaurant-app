import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchFavouriteRestaurants } from '../actions/favoriteRestaurantActions';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const FavoriteRestaurantScreen = ({
  favRestaurants,
  fetchFavouriteRestaurants,
}) => {
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
    .filter(
      (restaurant) =>
        restaurant.ratings > 10 && restaurant.userId === currentUserID
    )
    .sort((a, b) => b.ratings - a.ratings);

  return (
    <ScrollView style={styles.container}>
      {filteredRestaurants.length === 0 ? (
        <Text style={styles.emptyMessage}>
          No favorite restaurants to display. Add some favorites!
        </Text>
      ) : (
        filteredRestaurants.map((restaurant) => (
          <TouchableOpacity
            key={restaurant.id}
            style={styles.restaurantCard}
            
          >
            <Image
              source={{ uri: restaurant.restImage }}
              style={styles.restaurantImage}
            />
            <Text style={styles.restaurantName}>
              {restaurant.restName}
            </Text>
            <Text style={styles.restaurantRating}>
              Rating: {restaurant.ratings}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const mapStateToProps = (state) => ({
  favRestaurants: state.favoriteRestaurants.favRestaurants,
});

export default connect(mapStateToProps, {
  fetchFavouriteRestaurants,
})(FavoriteRestaurantScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3EEEA',
  },
  restaurantCard: {
    backgroundColor: '#83764F',
    padding: wp('4%'),
    margin: wp('2%'),
    borderRadius: wp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  restaurantImage: {
    width: '100%',
    height: hp('20%'),
    borderRadius: wp('2%'),
    marginBottom: hp('1%'),
  },
  restaurantName: {
    fontSize: wp('4.5%'),
    fontWeight: 'bold',
    marginBottom: hp('1%'),
    color: '#F3EEEA',
  },
  restaurantRating: {
    fontSize: wp('4%'),
    color: '#F3EEEA',
  },
  emptyMessage: {
    fontSize: wp('5%'),
    color: '#83764F',
    textAlign: 'center',
    marginTop: hp('10%'),
  },
});
