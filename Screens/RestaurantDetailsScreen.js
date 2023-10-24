import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const RestaurantDetailsScreen = ({ route }) => {
  const { restaurant } = route.params;
  const lunchTime = ['1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm'];
  const dinnerTime = ['1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm', '1:00 pm'];
  const { navigate } = useNavigation(); 

  const createGrid = (menuItems) => {
    return (
      <View style={styles.gridContainer}>
        {menuItems.map((item, index) => (
          <View style={styles.menuItem} key={index}>
            <Text>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />
      
      <TouchableOpacity 
      style={styles.imageButton}
      onPress={() => navigate('MenuScreen', { restId: restaurant.id })}
      >
        <Text style={styles.imageButtonText}>View Menu</Text>
      </TouchableOpacity>
      
      <Text style={styles.restName}>{restaurant.restName}</Text>

      <View style={styles.locationContainer}>
        <FontAwesome name="map-marker" size={15} color="#ccc" />
        <Text style={styles.locationText}>{restaurant.restLocation}</Text>
      </View>

      <View style={styles.likes}>
        <TouchableOpacity style={styles.shareBtn}>
          <Icon name="share" size={15} color="#ccc" />
          <Text style={styles.shareTxt}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveBtn}>
          <Icon name="save" size={15} color="#ccc" />
          <Text style={styles.saveTxt}>Save</Text>
        </TouchableOpacity>
      </View>

      <Text>Lunch</Text>
      {createGrid(lunchTime)}

      <Text>Dinner</Text>
      {createGrid(dinnerTime)}

      <Text>About {restaurant.restName}</Text>
      <Text>{restaurant.restInfo}</Text>
      <Text>{restaurant.restPhone}</Text>
      <Text>{restaurant.restWebsite}</Text>
    </ScrollView>
  );
}

export default RestaurantDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  imageButton: {
    position: 'absolute',
    top: 50,
    left: 180,
    backgroundColor: '#87CEFA',
    padding : 5,
    borderRadius: 5,
  },
  imageButtonText:{
    color: 'white'
  },
  restName: {
    color: '#ccc',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15,
  },
  locationText: {
    color: '#ccc',
  },
  likes: {
    flexDirection: 'row',
  },
  shareBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    borderWidth:1,
    borderColor: '#ccc',
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  shareTxt: {
    color: '#ccc',
  },
  saveTxt: {
    color: '#ccc',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
  },
  menuItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    margin: 5,
    alignItems: 'center',
    width: '30%',
  },
});
