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
            <View style={styles.passwordContainer}>
            <TextInput
                style={styles.input}
                placeholder="Enter new name"
                value={newName}
                onChangeText={(text) => setNewName(text)}
            />
            </View>
            <TouchableOpacity style={styles.resetBtn} onPress={onSaveChanges}>
                <Text style={styles.resetTxt}>Save Changes</Text>
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
      backgroundColor: '#fff',
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 90,
    color: 'gray',
    },
    input: {
      width: '100%',
      marginBottom: 10,
      padding: 12,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 25,
      color: '#ccc',
    },
    resetBtn: {
      backgroundColor: '#ccc',
      padding: 10,
      borderRadius: 25,
      marginTop: 20,
      width: '80%',
      marginBottom: 50,
    },
    resetTxt:{
      color: 'white',
    textAlign: 'center',
    },
    passwordContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '80%',
    },
  });
  