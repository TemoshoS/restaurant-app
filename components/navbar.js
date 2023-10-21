import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose any icon you prefer

const Navbar = () => {
  const getCurrentTimeOfDay = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 12) {
      return 'morning';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'afternoon';
    } else {
      return 'evening';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.user}>
        <Text style={styles.greetingText}>
          Good {getCurrentTimeOfDay()},
        </Text>
        <View style={styles.userRow}>
          <Icon name="user" size={20} color="#fff" /> {/* Adjust the icon and size */}
          <Text style={styles.userText}>Temosho</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  user: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 100
  },
  userText: {
    marginLeft: 10, // Adjust the margin to your preference
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Navbar;
