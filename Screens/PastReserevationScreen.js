import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { fetchPastReservations } from '../actions/reserveAction';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

const PastReserevationScreen = ({ pastReservations, fetchPastReservations }) => {
  useEffect(() => {
    // Fetch past reservations when the component mounts or when fetchPastReservations changes
    fetchPastReservations();
  }, [fetchPastReservations]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reservation History</Text>
      {pastReservations.map((reservation, index) => (
        <View key={index} style={styles.reservationCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.reservationDate}>
              {new Date(reservation.selectedDate.seconds * 1000).toLocaleDateString()}
            </Text>
            <Text style={styles.restaurantName}>{reservation.restName}</Text>
          </View>

          <Text style={styles.label}>Location:</Text>
          <Text style={styles.info}>{reservation.restLocation}</Text>

          <Text style={styles.label}>Full Name:</Text>
          <Text style={styles.info}>{reservation.fullName}</Text>

          <Text style={styles.label}>Phone Number:</Text>
          <Text style={styles.info}>{reservation.phone}</Text>

          <Text style={styles.label}>Occasion:</Text>
          <Text style={styles.info}>{reservation.occasion}</Text>

          <Text style={styles.label}>Number of Guests:</Text>
          <Text style={styles.info}>{reservation.numOfGuests}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  pastReservations: state.reservation.pastReservations,
});

export default connect(mapStateToProps, { fetchPastReservations })(PastReserevationScreen);

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
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  info: {
    fontSize: 16,
    marginBottom: 8,
  },
});
