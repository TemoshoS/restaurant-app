import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  
  const openingHours = [ '07:00 AM'];
  const closingHours = [ '11:00 PM'];
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const { navigate } = useNavigation(); 

  const createGrid = (menuItems) => {
    return (
      <View style={styles.gridContainer}>
        {menuItems.map((item, index) => (
          <View style={styles.menuItem} key={index}>
            <Text style={styles.menuItemText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />

      <TouchableOpacity 
        style={styles.imageButton}
        onPress={() => navigate('MenuScreen', { restId: restaurant.id, restImage: restaurant.restImage, restName: restaurant.restName, restLocation: restaurant.restLocation })}
      >
        <Text style={styles.imageButtonText}>Today's Menu</Text>
      </TouchableOpacity>

      <Text style={styles.restName}>{restaurant.restName}</Text>

      <View style={styles.locationContainer}>
        <FontAwesome name="map-marker" size={15} color="#333" />
        <Text style={styles.locationText}>{restaurant.restLocation}</Text>
      </View>

      <Text style={styles.sectionTitle}>Restaurant Hours of Operation</Text>
      <Text>Mon 07:00am - 11:00pm</Text>
      <Text>Tue 07:00am - 11:00pm</Text>
      <Text>Wed 07:00am - 11:00pm</Text>
      <Text>Thu 07:00am - 11:00pm</Text>
      <Text>Fri 07:00am - 11:00pm</Text>
      <Text>sar 07:00am - 11:00pm</Text>
      <Text>Sun 07:00am - 7:00pm</Text>
      <Text style={styles.sectionTitle}>About {restaurant.restName}</Text>
      <Text style={styles.aboutText}>{restaurant.restInfo}</Text>

      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <FontAwesome name="phone" size={20} color="#333" />
          <Text style={styles.contactText}>{restaurant.restPhone}</Text>
        </View>
        <View style={styles.contactItem}>
          <FontAwesome name="globe" size={20} color="#333" />
          <Text style={styles.contactText}>{restaurant.restWebsite}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

export default RestaurantDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#83764F',
  },
  restaurantImage: {
    width: '100%',
    height: 200,
  },
  imageButton: {
    position: 'absolute',
    top: 100,
    left: 140,
    backgroundColor: '#83764F',
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: '#ccc',
    fontWeight: 'bold',
  },
  restName: {
    color: '#333',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  locationText: {
    color: '#333',
    marginLeft: 5,
  },
  likes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  shareBtn: {
    borderWidth: 1,
    borderColor: '#3498db',
    borderRadius: 20,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  saveBtn: {
    borderWidth: 1,
    borderColor: '#FF6347',
    borderRadius: 20,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  shareTxt: {
    color: '#3498db',
  },
  saveTxt: {
    color: '#FF6347',
  },
  sectionTitle: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  menuItemText: {
    color: '#333',
    textAlign: 'center',
  },
  aboutText: {
    color: '#333',
    fontSize: 16,
    margin: 10,
    lineHeight: 20,
  },
  contactContainer: {
    margin: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  contactText: {
    color: '#333',
    marginLeft: 10,
  },
});
