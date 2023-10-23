import { StyleSheet, Text, View , Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';


const RestaurantDetailsScreen = ({route}) => {
  const {restaurant} = route.params;

  return (
    <View style={styles.container}>
       <Image source={{ uri: restaurant.restImage }} style={styles.restaurantImage} />
      <Text style={styles.restName}>{restaurant.restName}</Text>

      <View style={styles.locationContainer}>
        <FontAwesome name='map-marker' size={15} color='#ccc'/>
      <Text >{restaurant.restLocation}</Text>
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

      
    </View>
  )
}

export default RestaurantDetailsScreen

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'

  },
  restaurantImage: {
    width: '100%',
    height: 150,
    
  },
  locationContainer:{
    flexDirection: 'row',
    marginTop: 15,
    marginBottom: 15
  },
  restName:{
    color:'#ccc',
    marginLeft: 5,
    fontWeight: 'bold'
    
  },
  likes:{
    flexDirection: 'row'
  },
  shareBtn:{
    borderWidth: 1,
    borderColor : '#ccc',
    borderRadius: 20,
    width: 80,
    justifyContent:'center',
    alignItems: 'center'


   

  },
  saveBtn:{
    borderWidth: 1,
    borderColor : '#ccc',
    borderRadius: 20,
    width: 80,
    justifyContent: 'center',
    alignItems:'center',
    marginLeft: 10

  },
  shareTxt:{
    color: '#ccc'
  },
  saveTxt:{
    color: '#ccc'
  }
})