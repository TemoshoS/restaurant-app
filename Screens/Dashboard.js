import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { fetchAllReservations } from '../actions/reserveAction';

const Dashboard = ({ allReservations, fetchAllReservations }) => {
  useEffect(() => {
    // Fetch all reservations when the component mounts
    fetchAllReservations();
  }, [fetchAllReservations]);

  return (
    <View>
      <Text>Dashboard</Text>
      {/* Display all reservations here */}
      {allReservations.map((reservation) => (
        <Text key={reservation.id}>{/* Display reservation details here */}</Text>
      ))}
    </View>
  );
};

const mapStateToProps = (state) => ({
  allReservations: state.reserve.allReservations,
});

const mapDispatchToProps = {
  fetchAllReservations,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);

const styles = StyleSheet.create({});
