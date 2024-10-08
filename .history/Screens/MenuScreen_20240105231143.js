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
  Modal,
  TextInput
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { FontAwesome } from '@expo/vector-icons';


const MenuScreen = ({ route }) => {
  const { restId, restImage, restName, restLocation } = route.params;
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [image, setImage] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    menuName: '',
    menuPrice: '',
    menuDescription: '',
    menuImage: '',
    menuCate: '',
  });
  const storage = getStorage();
  const goToReservation = useNavigation();
  const {goBack}= useNavigation();
  const numColumns = 2;
  const cardWidth = Dimensions.get('window').width / numColumns;
  const user = auth.currentUser;
  const isAdmin = user ? user.email === 'temosho@admin.co' : false;

  useEffect(() => {
    fetchMenuItems();
  }, [restId]);

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

  const filterMenuItems = (category) => {
    if (category === 'all') {
      return menuItems;
    }
    return menuItems.filter((item) => item.menuCate === category);
  };

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
      if (!image) {
        alert('Please select an image.');
        return;
      }

      if (
        !newMenuItem.menuName ||
        !newMenuItem.menuDescription ||
        !newMenuItem.menuPrice ||
        !newMenuItem.menuCate
      ) {
        alert('Please fill in all required fields.');
        return;
      }

      const menuCollection = collection(db, 'Menu');
      const imageRef = ref(storage, `menuImages/${newMenuItem.menuName}`);

      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      const newMenuItemRef = await addDoc(menuCollection, {
        ...newMenuItem,
        restId,
        menuImage: imageUrl,
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
      const wantDelete = window.confirm('Are you sure you want to delete this menu?');

      if (wantDelete) {
        const menuRef = doc(db, 'Menu', menuId);
        await deleteDoc(menuRef);
        fetchMenuItems();
      }
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
      const { menuImage, ...updatedMenu } = selectedMenuItem;
      const menuRef = doc(db, 'Menu', selectedMenuItem.id);

      await updateDoc(menuRef, updatedMenu);
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

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);


        const contentType = "image/jpeg";

        const response = await fetch(result.uri);
        const blob = await response.blob();


        const imageRef = ref(storage, `restaurantImages/${newMenuItem.menuName}`);
        await uploadBytes(imageRef, blob, { contentType });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };



  return (
    // <ImageBackground source={require('../assets/food.jpg')} style={styles.backgroundImage}>
    <ScrollView contentContainerStyle={styles.container}>
    
    
    <Image source={{ uri: restImage }} style={styles.restaurantImage} />
       

        <TouchableOpacity style={styles.goBackBtn} onPress={() => goBack()}>
        <FontAwesome name="arrow-left" size={25} color="white" />
        </TouchableOpacity>
      <Text style={styles.restName}>{restName} Menu</Text>
        <View style={styles.detailsCard}>
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
            onPress={() => navigationItemDetails(item)}
            style={{ width: cardWidth, padding: 10 }}
          >
            <View style={styles.menuItem}>
              <Image source={{ uri: item.menuImage }} style={styles.ImageMenu} />
              <Text style={styles.menuName} numberOfLines={1}>
                {item.menuName}
              </Text>
              <Text style={styles.menuPrice}>R{item.menuPrice}</Text>

              {isAdmin && (
                <View style={styles.adminButtonsContainer}>
                  <TouchableOpacity

                    onPress={() => handleUpdate(item.id)}
                  >
                    <Ionicons name="create" size={24} color="#6082B6" />
                  </TouchableOpacity>
                  <TouchableOpacity

                    onPress={() => handleDelete(item.id)}
                  >
                    <Ionicons name="trash" size={24} color="#FF003F" />
                  </TouchableOpacity>

                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
        {isAdmin && (
        <TouchableOpacity style={styles.addButton} onPress={toggleCreateModal}>
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>
      )}
        </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isCreateModalVisible}
        onRequestClose={toggleCreateModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Menu Item</Text>

            {image && <Image source={{ uri: image }} style={{ width: 230, height: 200 }} />}
            <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
              <Text style={styles.modalButtonText}>Upload Image</Text>
            </TouchableOpacity>

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

            <Picker
              selectedValue={newMenuItem.menuCate}
              style={styles.select}
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


            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleCreateModal}
            >
              <Icon name="times" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


     
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
           

            <TouchableOpacity
              style={styles.closeButton}
              onPress={toggleUpdateModal}
            >
              <Icon name="times" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
    // </ImageBackground>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
   detailsCard: {
    width: '100%',
    backgroundColor: '#fff',
    top: -50,
    borderTopLeftRadius: 35,
    borderTopRightRadius :35,
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#83764F',
    fontWeight: 'bold',
  },
  restLocation: {
    fontSize: 18,
    color: 'white',
  },
  categoryFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  categoryButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginRight: 10,

  },
  selectedCategoryText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    textDecorationLine: 'underline',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#ccc',
  },
  menuItem: {
    backgroundColor: '#fff',
    padding: 16,
    margin: 10,
    elevation: 5,
    shadowColor: 'black',
    textShadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: 'center',
    width: '90%',
    

  },
  ImageMenu: {
    width: 140,
    height: 120,
    borderRadius: 10,
   
  },
  menuName: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#83764F',
    textAlign: 'left'
  },
  menuPrice: {
    fontSize: 16,
    color: '#83764F',
    left: 0
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#83764F',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff'
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    color: '#fff',
  },
  select: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    color: '#83764F',
  },
  modalButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 5
  },
  modalButtonText: {
    color: '#83764F',
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
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },
});