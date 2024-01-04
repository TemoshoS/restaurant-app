import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
// import MapView from 'react-native-maps';


const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  
  const openingHours = ['07:00 AM'];
  const closingHours = ['10:00 PM'];


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


  const openGoogleMaps = () => {
    const mapUrl = `https://maps.app.goo.gl/hGkJA82GhFoB4Wdt8`;
    
    if (restaurant.restLocation === restaurant.restLocation) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${restaurant.restLocation}`);
    } else {
      Linking.openURL(mapUrl);
    }
  };

  const openWebsite = () => {
    if (restaurant.restWebsite) {
      Linking.openURL(restaurant.restWebsite);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />

      <TouchableOpacity 
        style={styles.imageButton}
        onPress={() => navigate('Menu', { restId: restaurant.id, restImage: restaurant.restImage, restName: restaurant.restName, restLocation: restaurant.restLocation })}
      >
        <Text style={styles.imageButtonText}>View Menu</Text>
      </TouchableOpacity>

      <Text style={styles.restName}>{restaurant.restName}</Text>

      

      <Text style={styles.sectionTitle}>About Us</Text>
      <Text style={styles.aboutText}>{restaurant.restInfo}</Text>
      
      <TouchableOpacity style={styles.locationContainer} onPress={openGoogleMaps}>
        <FontAwesome name="map-marker" size={15} color="#333" />
        <Text style={styles.locationText}>{restaurant.restLocation}</Text>
      </TouchableOpacity>

      <View style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <FontAwesome name="phone" size={20} color="#333" />
          <Text style={styles.contactText}>{restaurant.restPhone}</Text>
        </View>
        <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
          <FontAwesome name="globe" size={20} color="#333" />
          <Text style={styles.contactText}>{restaurant.restWebsite}</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Operation hours</Text>
      {renderOperatingHours(openingHours, closingHours)}
    </ScrollView>
  );
}

export default RestaurantDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  operatingHoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dayOfWeek: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  operatingHoursText: {
    color: 'black',
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
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  restName: {
    color: 'black',
    fontSize: 24,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
   
  },
  locationText: {
    color: 'black',
    marginLeft: 5,
    fontWeight: 'bold',
    fontSize: '16px',
  },
  likes: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  shareBtn: {
    borderWidth: 1,
    borderColor: 'black',
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
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    margin: 10,
    justifyContent: 'center'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  menuItem: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: '45%',
  },
  menuItemText: {
    color: 'black',
    textAlign: 'center',
  },
  aboutText: {
    color: 'black',
    fontSize: 16,
    margin: 10,
    lineHeight: 20,
    fontFamily:'Playfair Display',
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
    color: 'black',
    marginLeft: 10,
  },
});
