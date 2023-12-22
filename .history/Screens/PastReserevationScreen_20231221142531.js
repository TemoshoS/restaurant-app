import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { fetchPastReservations } from '../actions/reserveAction';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const PastReservationScreen = ({ pastReservations, fetchPastReservations }) => {
  const [currentUserId, setCurrentUserId] = useState(null);

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
          return 'orange';
      default:
        return '#E7E6E1';
    }
  };

 

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
      {pastReservations.length > 0 ? (
        pastReservations.map((reservation, index) => (
          <View key={index} style={styles.reservationCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.reservationDate}>
                {new Date(reservation.selectedDate.seconds * 1000).toLocaleDateString()}
              </Text>
              <Text style={styles.restaurantName}>{reservation.restName}</Text>
            </View>

            <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
              <Row
                data={['Location:', reservation.restLocation]}
                style={styles.tableRow}
                textStyle={styles.info}
              />
              <Row
                data={['Full Name:', reservation.fullName]}
                style={styles.tableRow}
                textStyle={styles.info}
              />
              <Row
                data={['Phone Number:', reservation.phone]}
                style={styles.tableRow}
                textStyle={styles.info}
              />
              <Row
                data={['Occasion:', reservation.occasion]}
                style={styles.tableRow}
                textStyle={styles.info}
              />
              <Row
                data={['Number of Guests:', reservation.numOfGuests]}
                style={styles.tableRow}
                textStyle={styles.info}
              />
              <Row
              data={['Status:', reservation.status]}
              style={[styles.tableRow, { backgroundColor: getStatusColor(reservation.status) }]}
              textStyle={styles.info}
            />
            </Table>
          </View>
        ))
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
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  reservationCard: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reservationDate: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  restaurantName: {
    fontSize: 14,
    color: '#007BFF',
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
