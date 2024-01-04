import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';


const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorTable, setErrorTable] = useState('');
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [reason, setReason] = useState('');
  const [isBooking, setIsBooking] = useState(true);

  const fetchPendingOrders = async () => {
    const ordersCollection = collection(db, 'Orders');
    const ordersQuery = query(ordersCollection, where('status', '==', 'pending'));

    try {
      const querySnapshot = await getDocs(ordersQuery);

      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPendingOrders(orders);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };

  useEffect(() => {


    fetchPendingOrders();
  }, []);

  const handleSelectOrder = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const handleBookOrder = async () => {
    if (!tableNumber || isNaN(tableNumber)) {
      setErrorTable('Please enter a valid table number.');
      return;
    }

    if (selectedOrder) {
      const orderRef = doc(db, 'Orders', selectedOrder.id);

      try {
        await updateDoc(orderRef, {
          status: 'booked',
          tableNumber: tableNumber,
        });

        fetchPendingOrders();

        setSelectedOrder(null);
        setTableNumber('');
        setIsBooking(true);
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  const handleRejectOrder = async () => {

    if (selectedOrder) {
      const orderRef = doc(db, 'Orders', selectedOrder.id);

      try {
        await updateDoc(orderRef, {
          status: 'rejected',
          reason: reason,
        });

        fetchPendingOrders();

        setSelectedOrder(null);
        setTableNumber('');
        setReason('');
        setIsBooking(false);
        setIsModalVisible(false);
        setShowRejectionInput(false);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.orderList}>
        {pendingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderInfo}>Full Name: {order.fullName}</Text>
            <Text style={styles.orderInfo}>Email: {order.email}</Text>
            <Text style={styles.orderInfo}>Phone Number: {order.phone}</Text>
            <Text style={styles.orderInfo}>Number of guests: {order.numOfGuests}</Text>
            <Text style={styles.orderInfo}>Ocassion: {order.occasion}</Text>

            <View style={styles.statusInfo}>
              <Text style={styles.orderStatus}></Text>
              <Text style={styles.orderInfo}>{order.status}</Text>
            </View>
            <TouchableOpacity style={styles.selectBtn} onPress={() => handleSelectOrder(order)}>
              <Text style={styles.selectTxt}>Select Order</Text>
            </TouchableOpacity>

          </View>
        ))}
      </View>

      <Modal isVisible={isModalVisible} style={styles.modal}>
        <View style={styles.selectedOrderContainer}>
          <Text style={styles.selectedOrderTitle}>Selected Order:</Text>
          <Text style={styles.selectedOrderInfo}>{selectedOrder?.fullName}</Text>


          {!showRejectionInput && (
            <>

              <Text style={styles.selectedOrderInfo}>Table Number:</Text>
              <TextInput
                style={styles.input}
                value={tableNumber}
                onChangeText={(text) => setTableNumber(text.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                placeholder="Enter Table Number"
              />
              {errorTable && <Text style={styles.errorText}>{errorTable}</Text>}

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleBookOrder()}
              >
                <Text style={styles.buttonText}>Book Booking</Text>
              </TouchableOpacity>
            </>
          )}


          {showRejectionInput && (
            <View>
              <Text style={styles.selectedOrderInfo}>Rejection Message:</Text>
              <TextInput
                style={styles.input}
                value={reason}
                onChangeText={(text) => setReason(text)}
                placeholder="Enter Rejection Message"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (!showRejectionInput) {
                setShowRejectionInput(true);
              } else {
                handleRejectOrder();
                setShowRejectionInput(false);
              }
            }}
          >
            <Text style={styles.buttonText}>
              {showRejectionInput ? 'Confirm' : 'Reject Booking'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Icon name="times" size={30} color="#fff" />
          </TouchableOpacity>



        </View>
      </Modal>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'gray',
  },
  orderList: {
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: 'white',
  
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: 'gray',
    fontWeight: 'bold',
    fontFamily: ''
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  orderStatus: {

    width: 25,
    height: 25,
    marginBottom: 8,
    backgroundColor: 'red',
    borderRadius: 12.5,
    marginRight: 8


  },
  selectBtn: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 5,
    width: 100,
    alignItems: 'center',
    color: 'white',
  },
  selectTxt: {
    color: '#F3EEEA',
    fontWeight: 'bold',

  },
  selectedOrderContainer: {
    backgroundColor: '#83764F',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#F3EEEA',
  },
  selectedOrderInfo: {
    fontSize: 16,
    marginBottom: 8,
    color: '#F3EEEA',
  },

  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    color: '#F3EEEA',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F3EEEA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#83764F',
    textAlign: 'center',
    fontSize: 16,
  },
  errorText: {
    color: "#ff0000ea",
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
  },



});
