import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';


const EditProfileScreen = ({navigation}) => {
    const [newName, setNewName] = useState('');
  
    onSaveChanges = ()=>{

        navigation.goBack();
    }
  
  
    return (
    <View >
    
    </View>
  )
}

export default EditProfileScreen

const styles = StyleSheet.create({})