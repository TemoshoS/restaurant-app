import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


const EditProfileScreen = ({navigation}) => {
    const [newName, setNewName] = useState('');
  
    onSaveChanges = ()=>{

        navigation.goBack();
    }
  
  
    return (
    <View style={styles.conatiner}>
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

const styles = StyleSheet.create({})