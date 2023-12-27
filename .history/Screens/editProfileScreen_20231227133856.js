import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {  updateDoc,  doc } from 'firebase/firestore';


const EditProfileScreen = ({ navigation, route }) => {
     const { userDetails, handleInputChange } = route.params;
  const [newName, setNewName] = useState(userDetails?.name || '');
  const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setCurrentUser(user.displayName);
            setNewName(user.displayName);
            
          } else {
            setCurrentUser(null);
          }
        });
    
        return () => unsubscribe();
      }, []);


   const onSaveChanges = () => {
    try {
        navigation.navigate('profile');
    } catch (error) {
        console.log('')
        
    }

        
    }


    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter new name"
                value={newName}
                onChangeText={(text) => setNewName(text)}
            />
            <TouchableOpacity onPress={onSaveChanges}>
                <Text style={styles.saveButton}>Save Changes</Text>
            </TouchableOpacity>


        </View>
    )
}

export default EditProfileScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: 300,
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 20,
      padding: 10,
    },
    saveButton: {
      color: 'blue',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
  });
  