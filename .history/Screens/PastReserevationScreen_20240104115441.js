import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchPastReservations } from '../actions/reserveAction';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PastReservationScreen = ({ pastReservations, fetchPastReservations }) => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        fetchPastReservations(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, [fetchPastReservations]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'green';
      case 'canceled':
        return 'red'; 
        case 'pending':
          return 'yellow';
          case 'rejected':
        return 'red'; 
      default:
        return '#E7E6E1';
    }
  };

  const handleFilter = (status) => {
    setFilterStatus(status);
  };

  const filteredReservations = filterStatus
    ? pastReservations.filter((reservation) => reservation.status === filterStatus)
    : pastReservations;

  return (
    <ScrollView style={styles.container}>
    <View style={styles.filterButtonsContainer}>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => handleFilter(null)}
      >
        <Text style={styles.filterButtonText}>All</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => handleFilter('booked')}
      >
        <Text style={styles.filterButtonText}>Booked</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => handleFilter('pending')}
      >
        <Text style={styles.filterButtonText}>Pending</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => handleFilter('rejected')}
      >
        <Text style={styles.filterButtonText}>Rejected</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.title}>My Orders</Text>
    {filteredReservations.length > 0 ? (
      <View style={styles.tableContainer}>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
          {filteredReservations.map((reservation, index) => (
            <View key={index} style={styles.reservationCard}>
              {/* ... (your existing code for rendering reservation details) ... */}
            </View>
          ))}
        </Table>
      </View>
    ) : (
      <Text style={styles.emptyMessage}>No past reservations found.</Text>
    )}
  </ScrollView>

  );
};

const mapStateToProps = (state) => ({
  pastReservations: state.reservation.pastReservations,
});

export default connect(mapStateToProps, { fetchPastReservations })(PastReservationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#83764F',
  },
  tableContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ccc',
  },
  reservationCard: {
    backgroundColor: '#F3EEEA',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    
  },
  reservationDate: {
    fontSize: 18,
    color: '#83764F',
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: 18,
    color: '#83764F',
    fontWeight: 'bold',
  },
  tableRow: {
    height: 40,
    backgroundColor: '#E7E6E1',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});
