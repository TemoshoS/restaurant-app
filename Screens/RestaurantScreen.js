import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { fetchRestaurants } from '../actions/restaurant';
import Navbar from '../components/navbar';
import Search from '../components/search';


const RestaurantScreen = ({ restaurants, fetchRestaurants }) => {
  
    const [filteredRestaurants, setFilteredRestaurants] = useState([]);

    useEffect(() => {
    fetchRestaurants();
  }, []);

 
  const handleSearch = (searchText)=>{
    const filered = restaurants.filter((restaurant)=>
    restaurant.restName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredRestaurants(filered);
  }

  return (
    <View style={styles.container}>
          
        <Navbar/>
        <Search onSearch={handleSearch}/>
    
        <FlatList
        data={filteredRestaurants.length > 0 ? filteredRestaurants : restaurants}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item.restImage }}
              style={{ width: 300, height: 300 }}
            />
            <Text>{item.restName}</Text>
            <Text>{item.restLocation}</Text>
            <Text>{item.ratings}</Text>
          </View>
        )}
      />
    </View>
  );
};

const mapStateToProps = (state) => {
  return {
    restaurants: state.restaurants.restaurants,
  };
};

export default connect(mapStateToProps, { fetchRestaurants })(RestaurantScreen);

const styles = StyleSheet.create({

    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    }
})