import { StyleSheet, Text, View , FlatList, Image} from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../config/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'

const MenuScreen = ({ route }) => {
  const { restId } = route.params;
  const [menuItems, setMenuItems] = useState([]);

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

    }
    fetchMenuItems();
  }, [restId]);

  if (!menuItems) {
    return (
      <View>
        <Text>Loading Menu Details..</Text>
      </View>
    )
  }

  return (
    <View>
      <FlatList
        data={menuItems}
        keyExtractor={(menu) => menu.id}
        renderItem={({ menu }) => (
          <View style={styles.menuItem}>
            <Image source={{uri: menuImage}} style={styles.ImageMenu}/>
            <Text>{menu.menuName}</Text>
            
            
          </View>
        )}
      />
    </View>
  )
}

export default MenuScreen

const styles = StyleSheet.create({
  ImageMenu:{
    width: 20,
    height: 20
  }
})