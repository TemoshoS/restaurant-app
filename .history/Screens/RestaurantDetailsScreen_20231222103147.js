import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
// import MapView from 'react-native-maps';


const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  
  const openingHours = ['07:00 AM', '07:00 AM', '07:00 AM', '07:00 AM', '07:00 AM', '07:00 AM', '07:00 AM'];
  const closingHours = ['10:00 PM', '10:00 PM', '10:00 PM', '10:00 PM', '11:00 PM', '11:00 PM', '20:00 PM'];
  
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const renderOperatingHours = (openingHours, closingHours) => {
    return daysOfWeek.map((day, index) => (
      <View style={styles.operatingHoursItem} key={index}>
        <Text style={styles.dayOfWeek}>{day}</Text>
        <Text style={styles.operatingHoursText}>
          {openingHours[index]} - {closingHours[index]}
        </Text>
      </View>
    ));
  };
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

  const openGoogleMaps = () => {
    const mapUrl = `https://maps.app.goo.gl/hGkJA82GhFoB4Wdt8`;

    
    if (restaurant.restLocation.toLowerCase() === 'midrand') {
      // Open Google Maps with specific coordinates for Midrand
      Linking.openURL('https://www.google.com/maps/search/?api=1&query=-25.9955,28.1268');
    } else {
      // Open the default map link
      Linking.openURL(mapUrl);
    }
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

      <TouchableOpacity style={styles.locationContainer} onPress={openGoogleMaps}>
        <FontAwesome name="map-marker" size={15} color="#333" />
        <Text style={styles.locationText}>{restaurant.restLocation}</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Restaurant Hours of Operation</Text>
      {renderOperatingHours(openingHours, closingHours)}

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
  operatingHoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dayOfWeek: {
    color: '#ccc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  operatingHoursText: {
    color: '#ccc',
    fontSize: 16,
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
    color: '#ccc',
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
    color: '#ccc',
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
    color: '#ccc',
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
    color: '#ccc',
    textAlign: 'center',
  },
  aboutText: {
    color: '#ccc',
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
    color: '#ccc',
    marginLeft: 10,
  },
});
