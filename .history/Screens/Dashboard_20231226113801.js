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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  orderInfo: {
    fontSize: 16,
    marginBottom: 8,
  },
  orderStatus: {
    fontSize: 16,
    width: 80,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'red',
    color: 'white',
    fontWeight: 'bold'
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
  selectBtn: {
    backgroundColor: '#83764F'
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
