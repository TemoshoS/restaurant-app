import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const Search = ({ onSearch }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="black"
          onChangeText={(text) => onSearch(text)}
        />
        <Ionicons name="search" size={22} color="#000" style={styles.searchIcon} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
    width: '80%',
    borderWidth:1,
    borderColor: '#ccc',
    
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'black',
    
  },
});

export default Search;
