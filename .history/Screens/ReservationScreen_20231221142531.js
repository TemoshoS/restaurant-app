import { StyleSheet, View, Text, ScrollView, Modal, ImageBackground, TouchableOpacity, TextInput, Picker, CheckBox } from 'react-native'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { reserveTable } from '../actions/reserveAction';
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Touchable } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


// Define your ReservationScreen component
const ReservationScreen = ({ route }) => {
  // Extract restaurant details from the route
  const { restImage, restName, restLocation } = route.params;
  // State variables to hold form inputs and errors
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
  const [numOfGuests, setNumOfGuests] = useState(1);

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

 // Function to handle the reservation process
const handleReservation = () => {
  let hasError = false; // Flag to track if any errors occurred

  // Validate full name
  if (!fullName) {
    setFullNameError('Please fill in full name');
    hasError = true;
  } else {
    setFullNameError(''); // Clear the error message if it's filled
  }

  // Validate email
  if (!email) {
    setEmailError('Please fill in email');
    hasError = true;
  } else {
    setEmailError(''); // Clear the error message if it's filled
  }

  // Validate phone number
  if (!phone) {
    setPhoneError('Please fill in phone number');
    hasError = true;
  } else {
    setPhoneError(''); // Clear the error message if it's filled
  }
  // Validate number of guests (if necessary)
  if (numOfGuests < 1) {
    hasError = true;
  }

  if (hasError) {
    return; // Prevent reservation if there are errors
  } else {
    // Continue with the reservation if there are no errors

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is authenticated, you can access the user's ID
      const reservationData = {
        userId: user.uid, // Save the current user's ID
        fullName,
        email,
        phone,
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
      setConfirmationVisible(true); // Show confirmation modal

      // Clear all fields after confirming the reservation
      setFullName('');
      setEmail('');
      setPhone('');
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

  // Function to hide the confirmation modal
  const hideConfimation = () => {
    setConfirmationVisible(false);
  };

  // Return the component's JSX
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={{ uri: restImage }} style={styles.restaurantImage}>
        <View style={styles.overlay}>
          <Text style={styles.restName}>{restName}</Text>
          <Text style={styles.restLocation}>{restLocation}</Text>
        </View>
      </ImageBackground>

      <Text>Select Date and Time</Text>
      <TouchableOpacity onPress={showDatePicker}>
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
      />


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
  );
};

// Export the ReservationScreen component
export default ReservationScreen;

// Define the component's styles
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
  userLabel: {
    fontSize: 16,
    fontWeight: 'bold',

  },
  input: {
    width: '80%',
    marginVertical: 8,
    padding: 8,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
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
  confirmationModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 20,
  },
  confirmTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});
