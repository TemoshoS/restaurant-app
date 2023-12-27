import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth, onAuthStateChanged ,updateProfile} from 'firebase/auth';
import {  updateDoc,  doc ,getDoc, setDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';

const EditProfileScreen = ({ navigation, route }) => {
    const [newName, setNewName] = useState('');
    const [currentUser, setCurrentUser] = useState(null);
    const auth = getAuth();
    const firestore = getFirestore();

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


      const onSaveChanges = async () => {
        try {
          const user = auth.currentUser;
          await updateProfile(user, { displayName: newName });
      
          const userDocRef = doc(firestore, 'users', user.uid);
          const docSnapshot = await getDoc(userDocRef);

          if (docSnapshot.exists()) {
            
            await updateDoc(userDocRef, { displayName: newName });

          } else {
           
            await setDoc(userDocRef, { displayName: newName });
          }
      
          navigation.navigate('profile');
        } catch (error) {
          console.error('Error updating profile:', error);
        }
      };
      


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
  