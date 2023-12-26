import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView,TouchableOpacity } from 'react-native';
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import Modal from 'react-native-modal';


const Dashboard = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [tableNumber, setTableNumber] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [rejectionMessage, setRejectionMessage] = useState('');

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

  const handleChangeStatus = async (newStatus) => {
    if (selectedOrder) {
      const orderRef = doc(db, 'Orders', selectedOrder.id);

      try {
        await updateDoc(orderRef, {
          status: newStatus,
          tableNumber: tableNumber, 
        });

      
        fetchPendingOrders();

       
        setSelectedOrder(null);
        setTableNumber('');
        setIsModalVisible(false);
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }

  };

  return (
    <ScrollView contentContainerStyle ={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.orderList}>
        {pendingOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <Text style={styles.orderInfo}>{order.fullName}</Text>
            <Text style={styles.orderInfo}>{order.numOfGuests}</Text>
            <Text style={styles.orderInfo}>{order.occasion}</Text>
            <Text style={styles.orderInfo}>{order.email}</Text>
            <Text style={styles.orderInfo}>{order.phone}</Text>
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
          <Text style={styles.selectedOrderInfo}>Table Number:</Text>
          <TextInput
            style={styles.input}
            value={tableNumber}
            onChangeText={(text) => setTableNumber(text)}
            placeholder="Enter Table Number"
          />
          <Button title="Book Order" onPress={() => handleChangeStatus('booked')} />
          <Button title="Reject Order" onPress={() => handleChangeStatus('rejected')} />
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
         
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#83764F',
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderList: {
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#F3EEEA',
    borderRadius: 5,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderColor: '#ddd',
    borderWidth: 1,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 8,
    color:'gray',
    fontWeight:'bold',
    fontFamily: ''
  },
  statusInfo:{
    flexDirection: 'row',
    alignItems: ''
  },
  orderStatus: {
    
    width: 40,
    height: 40,
    marginBottom: 8,
    backgroundColor: 'red',
    borderRadius: 20,
    
    
  },
  selectBtn: {
    backgroundColor: '#83764F',
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
    backgroundColor: 'white',
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
  },
  selectedOrderInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  
});
