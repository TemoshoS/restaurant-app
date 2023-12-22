import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  Dimensions,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const MenuScreen = ({ route }) => {
  const { restId, restImage, restName, restLocation } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    menuName: '',
    menuPrice: '',
    menuDescription: '',
    menuImage: '',
    menuCate: '',
  });


  const fetchMenuItems = async () => {
    try {
      const menuCollection = collection(db, 'Menu');
      const menuQuery = query(menuCollection, where('restId', '==', restId));
      const menuSnapshot = await getDocs(menuQuery);
      const menuData = [];

      menuSnapshot.forEach((doc) => {
        menuData.push({ id: doc.id, ...doc.data() });
      });

      setMenuItems(menuData);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, [restId]);


  const goToReservation = useNavigation();

  const navigationItemDetails = (item) => {
    if (!isAdmin) {

      goToReservation.navigate('ReservationScreen', {
        restImage,
        restName,
        restLocation,
      });
    } else {

    }
  };

  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns;

  const filterMenuItems = (category) => {
    if (category === 'all') {
      return menuItems;
    }
    return menuItems.filter((item) => item.menuCate === category);
  };

  const user = auth.currentUser;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false; 
  const toggleCreateModal = () => {
    setCreateModalVisible(!isCreateModalVisible);
  };

  const handleInputChange = (field, value) => {
    setNewMenuItem({
      ...newMenuItem,
      [field]: value,
    });
  };

  const handleAddMenuItem = async () => {
    try {
      const menuCollection = collection(db, 'Menu');
      const newMenuItemRef = await addDoc(menuCollection, {
        ...newMenuItem,
        restId,
      });

      const autoGeneratedId = newMenuItemRef.id;
      await updateDoc(newMenuItemRef, {
        id: autoGeneratedId,
      });

      fetchMenuItems();

      toggleCreateModal();
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const handleDelete = async (menuId) => {
    try {
      const menuRef = doc(db, 'Menu', menuId);
      await deleteDoc(menuRef);
      fetchMenuItems();
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const toggleUpdateModal = () => {
    setUpdateModalVisible(!isUpdateModalVisible);
  };

  const handleUpdateInputChange = (field, value) => {
    setSelectedMenuItem({
      ...selectedMenuItem,
      [field]: value,
    });
  };

  const handleUpdateMenuItem = async () => {
    try {
      const menuRef = doc(db, 'Menu', selectedMenuItem.id);
      await updateDoc(menuRef, selectedMenuItem);
      fetchMenuItems();
      toggleUpdateModal();
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const handleUpdate = (menuId) => {
    const selected = menuItems.find((item) => item.id === menuId);
    setSelectedMenuItem(selected);
    toggleUpdateModal();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>





     {/* ... (previous code) */}
<Modal
  animationType="slide"
  transparent={true}
  visible={isCreateModalVisible}
  onRequestClose={toggleCreateModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Add New Menu Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Menu Item Name"
        onChangeText={(text) => handleInputChange('menuName', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Menu Item Price"
        onChangeText={(text) => handleInputChange('menuPrice', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Menu Item Description"
        onChangeText={(text) => handleInputChange('menuDescription', text)}
      />
      {/* Image picker button */}
      <TouchableOpacity style={styles.modalButton} >
        <Text style={styles.modalButtonText}>Pick Image</Text>
      </TouchableOpacity>
      <Picker
        selectedValue={newMenuItem.menuCate}
        style={styles.input}
        onValueChange={(itemValue) => handleInputChange('menuCate', itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Appetizer" value="appetizer" />
        <Picker.Item label="Main Course" value="main course" />
        <Picker.Item label="Dessert" value="dessert" />
      </Picker>
      <TouchableOpacity style={styles.modalButton} onPress={handleAddMenuItem}>
        <Text style={styles.modalButtonText}>Add Menu Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={toggleCreateModal}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>



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
      {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={toggleCreateModal}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
      <FlatList
        data={filterMenuItems(selectedCategory)}
        keyExtractor={(menu) => menu.id}
        numColumns={numColumns}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigationItemDetails(item)}
            style={{ width: cardWidth, padding: 10 }}
          >
            <View style={styles.menuItem}>
              <Image source={{ uri: item.menuImage }} style={styles.ImageMenu} />
              <Text style={styles.menuName} numberOfLines={1}>
                {item.menuName}
              </Text>
              <Text style={styles.menuPrice}>R{item.menuPrice}</Text>
              <Text style={styles.menuDescription}>
                <b>Ingredients: </b>
                {item.menuDescription}
              </Text>
              {isAdmin && (
                <View style={styles.adminButtonsContainer}>
                  <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() => handleUpdate(item.id)}
                  >
                    <Text style={styles.adminButtonText}>Update</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.adminButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Text style={styles.adminButtonText}>Delete</Text>
                  </TouchableOpacity>

                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
       {/* Modal for Updating a Menu Item */}
<Modal
  animationType="slide"
  transparent={true}
  visible={isUpdateModalVisible}
  onRequestClose={toggleUpdateModal}
>
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Update Menu Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Updated Menu Item Name"
        value={selectedMenuItem ? selectedMenuItem.menuName : ''}
        onChangeText={(text) => handleUpdateInputChange('menuName', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Updated Menu Item Price"
        value={selectedMenuItem ? selectedMenuItem.menuPrice : ''}
        onChangeText={(text) => handleUpdateInputChange('menuPrice', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Updated Menu Item Description"
        value={selectedMenuItem ? selectedMenuItem.menuDescription : ''}
        onChangeText={(text) => handleUpdateInputChange('menuDescription', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Updated Menu Item Category"
        value={selectedMenuItem ? selectedMenuItem.menuCate : ''}
        onChangeText={(text) => handleUpdateInputChange('menuCate', text)}
      />

      <TouchableOpacity style={styles.modalButton} onPress={handleUpdateMenuItem}>
        <Text style={styles.modalButtonText}>Update Menu Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modalButton} onPress={toggleUpdateModal}>
        <Text style={styles.modalButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

    </ScrollView>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#83764F',
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
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    margin: 10,
    elevation: 5,
    shadowColor: 'black',
    textShadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    alignItems: 'center',
    width: '90%',
    height: 500,
  },
  ImageMenu: {
    width: 120,
    height: 100,
  },
  menuName: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    overflow: 'hidden',
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
  adminButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  adminButton: {
    padding: 8,
    backgroundColor: '#3498db',
    borderRadius: 5,
    margin: 5,
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#3498db',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'green',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
});
