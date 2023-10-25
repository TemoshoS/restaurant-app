import { StyleSheet, Text, View, FlatList, Image, ScrollView, Dimensions, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-web';

const MenuScreen = ({ route }) => {
  const { restId,restImage, restName, restLocation } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchMenuItems = async () => {
      const menuCollection = collection(db, 'Menu');
      const menuQuery = query(menuCollection, where('restId', '==', restId));
      const menuSnapshot = await getDocs(menuQuery);
      const menuData = [];

      menuSnapshot.forEach((doc) => {
        menuData.push(doc.data());
      });

      setMenuItems(menuData);
    };
    fetchMenuItems();
  }, [restId]);

  const goToReservation = useNavigation();
  
  const navigationItemDetails =(item) =>{
    goToReservation.navigate('ReservationScreen', {
      restImage,
      restName,
      restLocation,
    });
    
  };

  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns;

const filterMenuItems = (category) =>{
  if(category=== 'all'){
    return menuItems;
  }
  return menuItems.filter((item)=> item.menuCate === category);
};

  return (
    <ScrollView contentContainerStyle ={styles.container}>
       <ImageBackground source={{ uri: restImage }} style={styles.restaurantImage}>
        <View style={styles.overlay}>
          <Text style={styles.restName}>{restName}</Text>
          <Text style={styles.restLocation}>{restLocation}</Text>
        </View>
      </ImageBackground>


      <View style={styles.categoryFilter}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory('all')}
        >

          <Text style={selectedCategory === 'all' ? styles.selectedCategoryText : styles.categoryText}>
            All
          </Text>

        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory('appetizer')}
        >
          <Text style={selectedCategory === 'appetizer' ? styles.selectedCategoryText : styles.categoryText}>
            Appetizer
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory('main course')}
        >
          <Text style={selectedCategory === 'main course' ? styles.selectedCategoryText : styles.categoryText}>
            Main Course
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() => setSelectedCategory('dessert')}
        >
          <Text style={selectedCategory === 'dessert' ? styles.selectedCategoryText : styles.categoryText}>
            Dessert
          </Text>
        </TouchableOpacity>

      </View>
      <FlatList
        data={filterMenuItems(selectedCategory)}
        keyExtractor={(menu) => menu.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
          onPress={()=>navigationItemDetails(item)}
          style = {{width: cardWidth, padding: 10}}
          >
          <View style={styles.menuItem}>
            <Image source={{ uri: item.menuImage }} style={styles.ImageMenu} />
            <Text style={styles.menuName} numberOfLines={1}>{item.menuName}</Text>
            <Text style={styles.menuPrice}>R{item.menuPrice}</Text>

            <Text style={styles.menuDescription}><b>Ingredients: </b>{item.menuDescription}</Text>
            
          </View>
          </TouchableOpacity>
        )}
      />
    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FDF5E6'
  },
  restaurantImage: {
    width: '100%',
    height: 150,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 10,
  },
  restName: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  restLocation: {
    fontSize: 18,
    color: 'white',
  },
   categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#FDF5E6',
    borderRadius: 5,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  categoryText: {
    fontWeight: 'normal',
  },
  menuItem:{
    backgroundColor: 'white',
    borderRadius : 10,
    padding: 16,
    margin: 10,
    elevation: 5,
    shadowColor: 'black',
    textShadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    
    alignItems: 'center',
    width: '90%',
    height: 500


  },
  ImageMenu: {
    width: 120, 
    height: 100,
  },
  menuName: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    overflow : 'hidden',
    textOverflow: 'ellipsis',
  },
  menuPrice: {
    fontSize: 16,
    color: '#ff6600', 
  },
  menuDescription: {
    fontSize: 14,
    marginTop: 10,
    color: '#666666', 
  },
});
