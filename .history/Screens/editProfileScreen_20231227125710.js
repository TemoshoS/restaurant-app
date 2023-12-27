import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


const EditProfileScreen = ({ navigation }) => {
    const [newName, setNewName] = useState('');

    onSaveChanges = () => {

        navigation.navigate('profile');
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
  