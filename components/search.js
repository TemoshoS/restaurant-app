import { StyleSheet,View, TextInput} from 'react-native'
import React from 'react';


const Search = ({ onSearch }) => {
   
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder='Search'
                onChangeText={(text) => onSearch(text)}
            />
        
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchInput:{
        backgroundColor: '#ccc',
        padding: 9,
        width: 310,
        marginBottom: 20,
        borderRadius: 20
    }
})