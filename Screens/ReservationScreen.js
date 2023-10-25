import { StyleSheet, View, Text,ScrollView, ImageBackground,TouchableOpacity,TextInput,Picker,CheckBox,} from 'react-native'
import React, { useState } from 'react';

const ReservationScreen = ({route}) => {
    const { restImage, restName, restLocation } = route.params;
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [occasion, setOccasion] = useState('');
    const [specialRequest, setSpecialRequest] = useState('');
    const [isAgreed, setIsAgreed] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={{ uri: restImage }} style={styles.restaurantImage}>
        <View style={styles.overlay}>
          <Text style={styles.restName}>{restName}</Text>
          <Text style={styles.restLocation}>{restLocation}</Text>
        </View>
      </ImageBackground>

      <Text>Dinner Details</Text>
      <Text>Full Name</Text>
          <TextInput
              style={styles.input}
              placeholder='Full Name'
              value={fullName}
              onChangeText={(text) => setFullName(text)}

          />
      <Text>Email Address</Text>
          <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={email}
              onChangeText={(text) => setEmail(text)}
          />
      <Text>Phone</Text>
          <TextInput
              style={styles.input}
              placeholder="Phone"
              value={phone}
              onChangeText={(text) => setPhone(text)}
          />
      <Text>Select an Occasion (Optional)</Text>
          <Picker
              selectedValue={occasion}
              onValueChange={(itemValue, itemIndex) => setOccasion(itemValue)}
              style={styles.input}
          >
              <Picker.Item label="Select an Occasion (Optional)" value="" />
              <Picker.Item label="Anniversary" value="anniversary" />
              <Picker.Item label="Birthday" value="birthday" />
              <Picker.Item label="Other" value="other" />
          </Picker>
      <Text>Add a Special Request(Optional)</Text>
          <TextInput
              style={styles.textArea}
              placeholder="Add a Special Request (Optional)"
              multiline={true}
              numberOfLines={8}
              value={specialRequest}
              onChangeText={(text) => setSpecialRequest(text)}
          /> 

          <View style={styles.checkboxContainer}>
              <CheckBox
                  value={isAgreed}
                  onValueChange={() => setIsAgreed(!isAgreed)}
              />
              <Text style={styles.checkboxLabel}>
                  By clicking "Reserve Now" you agree to The Terms of Use and Privacy Policy
              </Text>
          </View>
          <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Reserve Now</Text>
      </TouchableOpacity>

    </ScrollView>
  )
}

export default ReservationScreen
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FDF5E6',
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
    input: {
        width: '80%',
        marginVertical: 10,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
      },
      textArea: {
        width: '80%',
        marginVertical: 10,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        height: 500,
      },
      checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      checkboxLabel: {
        marginLeft: 10,
      },
      button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
      },
      buttonText: {
        color: 'white',
        fontWeight: 'bold',
      },
    
  });