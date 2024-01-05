import React, {useState} from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity,TouchableHighlight, ScrollView,Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';



const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  const { navigate , goBack} = useNavigation(); 
  const [buttonOpacity] = useState(new Animated.Value(1));


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

  const handleButtonPress = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0.5,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  };

  const handleButtonRelease = () => {
    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  };


  return (
    <ScrollView style={styles.container}>
       <View>
        <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />

        <TouchableHighlight
          style={[styles.imageButton, { opacity: buttonOpacity }]}
          onPress={() => navigate('Menu', { restId: restaurant.id, restImage: restaurant.restImage, restName: restaurant.restName, restLocation: restaurant.restLocation })}
          onPressIn={handleButtonPress}
          onPressOut={handleButtonRelease}
          underlayColor="blue" 
        >
          <Text style={styles.imageButtonText}>View Menu</Text>
        </TouchableHighlight>

        <TouchableOpacity style={styles.goBackBtn} onPress={() => goBack()}>
        <FontAwesome name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsCard}>
     

      

      <Text style={styles.sectionTitle}>About {restaurant.restName}</Text>
      <Text style={styles.aboutText}>{restaurant.restInfo}</Text>
      
      <TouchableOpacity style={styles.locationContainer} onPress={openGoogleMaps}>
        <FontAwesome name="map-marker" size={15} color="#333" />
        <Text style={styles.locationText}>{restaurant.restLocation}</Text>
      </TouchableOpacity>

      
      <View style={styles.businessHoursCard}>
     
    <FontAwesome name="clock-o" size={28} color="black" />
  
      <Text style={styles.sectionTitle}>Business hours</Text>
      <Text style={styles.operatingHoursText}>Monday – Friday: 08:00 – 11:00</Text>
      <Text style={styles.operatingHoursText}>Sartuday – Sunday: 08:00 – 9:00</Text>
      
      
      <View style={styles.contactContainer}>
        <View style={styles.separator} /> 
        <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
          <FontAwesome name="globe" size={20} color="#333" />
          <Text style={styles.contactText}>Visit Our Website</Text>
        </TouchableOpacity>
        

        <View style={styles.contactItem}>
          <FontAwesome name="phone" size={20} color="#333" />
          <Text style={styles.contactText}>{restaurant.restPhone}</Text>
        </View>
      </View>
  </View>
  </View>
    </ScrollView>
  );
}

export default RestaurantDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailsCard: {
    width: '100%',
    backgroundColor: '#fff',
    top: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius :30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  businessHoursCard:{
    width: '90%',
    height: 270,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    position: 'relative',
  },
  clockContainer: {
    position: 'absolute', 
    
  },

  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginVertical: 10,
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
    color: '#ccc',
    fontSize: 16,
    margin: 10,
  },
  restaurantImage: {
    width: '100%',
    height: 300,
  },
  goBackBtn:{
   position: 'absolute',
   top: 20,
   left: '5%',
   marginLeft: -1,
   backgroundColor: '#ccc',
   width: 50,
   height: 50,
   borderRadius: 25,
   justifyContent: 'center',
  alignItems: 'center',
  },
  imageButton: {
    position: 'absolute',
    top: 100,
    left: '50%',
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginLeft: -50,
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
    color: 'gray',
    fontSize: 17,
    margin: 10,
    lineHeight: 20,
    fontFamily:'Sevillana',
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
