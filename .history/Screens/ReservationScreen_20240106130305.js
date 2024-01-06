import { StyleSheet, View, Text, ScrollView, Modal, ImageBackground, TouchableOpacity, TextInput, Picker, CheckBox } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reserveTable } from '../actions/reserveAction';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FontAwesome } from '@expo/vector-icons';
import * as Notifications from "expo-notifications";


const ReservationScreen = ({ route }) => {
  
  const { restImage, restName, restLocation } = route.params;
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [occasion, setOccasion] = useState('');
  const [specialRequest, setSpecialRequest] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [dateTimeError, setDateTimeError] = useState('');
  const [numOfGuests, setNumOfGuests] = useState(1);
  const {goBack}= useNavigation();
  const dispatch = useDispatch();

  // Function to show the date picker
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Function to hide the date picker
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Function to handle the date selection
  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  // Function to show the time picker
  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  // Function to hide the time picker
  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  // Function to handle the time selection
  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

 
const handleReservation = () => {
  let hasError = false; 

  
  if (!fullName) {
    setFullNameError('Please fill in full name');
    hasError = true;
  } else {
    setFullNameError(''); 
  }

  
  if (!email) {
    setEmailError('Please fill in email');
    hasError = true;
  } else {
    setEmailError(''); 
  }

 
  if (!phone) {
    setPhoneError('Please fill in phone number');
    hasError = true;
  } else {
    setPhoneError(''); 
  }

  if(!dateTime){
    setDateTimeError('Please fill in time and date');
    hasError = true;
  } else{
    setDateTimeError('');
  }
  
  if (numOfGuests < 1) {
    hasError = true;
  }

  if (hasError) {
    return; 
  } else {
   

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
 
      const reservationData = {
        userId: user.uid, 
        fullName,
        email,
        phone,
        dateTime,
        occasion,
        specialRequest,
        isAgreed,
        restName,
        restLocation,
        selectedDate,
        numOfGuests,
        status: 'pending',
      };
      dispatch(reserveTable(reservationData));
      sendNotification()
      setConfirmationVisible(true); 

      
      setFullName('');
      setEmail('');
      setPhone('');
      setDateTime('');
      setOccasion('');
      setSpecialRequest('');
      setIsAgreed(false);
      setSelectedDate(new Date());
      setSelectedTime(new Date());
      setNumOfGuests(1);
    } else {
      
    }
  });

      }}

  
  const hideConfimation = () => {
    setConfirmationVisible(false);
  };

  const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Restaurant",
          body: "Alert has been sent to your contacts",
        },
        trigger: null,
      });

      console.log("Notification scheduled: ", notificationId);
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  };
 
  return (
    <ImageBackground source={require('../assets/food.jpg')} style={styles.backgroundImage}>
    <ScrollView contentContainerStyle={styles.container}>
    <TouchableOpacity style={styles.goBackBtn} onPress={() => goBack()}>
        <FontAwesome name="arrow-left" size={25} color="white" />
        </TouchableOpacity>

      {/* <ImageBackground source={{ uri: restImage }} style={styles.restaurantImage}>
        <View style={styles.overlay}>
          <Text style={styles.restName}>{restName}</Text>
          <Text style={styles.restLocation}>{restLocation}</Text>
        </View>
      </ImageBackground> */}
      <View style={styles.card}>
{/* 

      <Text>Select Date and Time</Text>
      {/* <TouchableOpacity onPress={showDatePicker}>
        <Text>{selectedDate.toDateString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleDateConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity onPress={showTimePicker}>
        <Text>{selectedTime.toLocaleTimeString()}</Text>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleTimeConfirm}
        onCancel={hideTimePicker}
      /> */} 


      <Text style={styles.userLabel}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder='Full Name'
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      {fullNameError && <Text style={styles.errorText}>{fullNameError}</Text>}

      <Text style={styles.userLabel}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {emailError && <Text style={styles.errorText}>{emailError}</Text>}

      <Text style={styles.userLabel}>Phone *</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone"
        value={phone}
        onChangeText={(text) => setPhone(text)}
      />
      {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}


      <Text style={styles.userLabel}>Date and Time *</Text>
      <TextInput
        style={styles.input}
        placeholder="2023-12-22  13:13pm"
        value={dateTime}
        onChangeText={(text) => setDateTime(text)}
      />
      {dateTimeError && <Text style={styles.errorText}>{dateTimeError}</Text>}

      <Text style={styles.userLabel}>Select an Occasion (Optional)</Text>
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

      <Text style={styles.userLabel}>Number of Guests *</Text>
      <Picker
        selectedValue={numOfGuests}
        onValueChange={(itemValue) => setNumOfGuests(itemValue)}
        style={styles.input}
      >
        <Picker.Item label='1 guest' value={1} />
        <Picker.Item label='2 guest' value={2} />
        <Picker.Item label='3 guest' value={3} />
        <Picker.Item label='4 guest' value={4} />
        <Picker.Item label='5 guest' value={5} />
        <Picker.Item label='6 guest' value={6} />
        <Picker.Item label='7 guest' value={7} />
        <Picker.Item label='8 guest' value={8} />
        <Picker.Item label='9 guest' value={9} />
        <Picker.Item label='10 guest' value={10} />

      </Picker>
      <Text style={styles.userLabel}>Add a Special Request(Optional)</Text>
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleReservation}>
        <Text style={styles.buttonText}>Reserve Now</Text>
      </TouchableOpacity>
      </View>
      <Modal
        animationType='slide'
        transparent={true}
        visible={isConfirmationVisible}
        onRequestClose={hideConfimation}
      >
        <View style={styles.confirmationModal}>
          <Text style={styles.confirmTxt}>Your reservation has been confirmed!</Text>
          <TouchableOpacity onPress={hideConfimation}>
            <Text style={styles.confirmTxt}>Ok</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </ScrollView>
    </ImageBackground>
    
  );
};


export default ReservationScreen;


const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative',
   
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
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
  card: {
    width: '80%',
    minHeight: '40vh',
    padding: 20,
    borderRadius: 3,
    backgroundColor: '#fff',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100
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
    color: '#ccc',
    fontWeight: 'bold',
  },
  restLocation: {
    fontSize: 18,
    color: '#ccc',
  },
  userLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',

  },
  input: {
    width: '80%',
    marginVertical: 8,
    padding: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    color: '#ccc',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  textArea: {
    width: '80%',
    marginVertical: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    height: 100,
    color: '#ccc',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 40,
    marginRight: 40,
  },
  checkboxLabel: {
    marginLeft: 10,
    color: '#ccc',
  },
  button: {
    backgroundColor: '#F3EEEA',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: '#83764F',
    fontWeight: 'bold',
  },
  confirmationModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  confirmTxt: {
    color: '#ccc',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
