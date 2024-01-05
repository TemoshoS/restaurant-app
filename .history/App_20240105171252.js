// Import necessary components and modules
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import RegisterScreen from './Screens/RegisterScreen';
import RestaurantScreen from './Screens/RestaurantScreen';
import RestaurantDetailsScreen from './Screens/RestaurantDetailsScreen';
import MenuScreen from './Screens/MenuScreen';
import ReservationScreen from './Screens/ReservationScreen';
import PastReserevationScreen from './Screens/PastReserevationScreen';
import ProfileScreen from './Screens/ProfileScreen';
import store from './store/store';
import { Provider } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteRestaurantScreen from './Screens/FavoriteRestaurantScreen';
import ForgotPasswordScreen from './Screens/ForgotPasswordScreen'
import Dashboard from './Screens/Dashboard';
import EditProfileScreen from './Screens/editProfileScreen';
import { auth } from './config/firebase';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      const isAdminUser = user ? user.email === 'temosho@admin.co' : false; 
      setIsAdmin(isAdminUser);
      console.log('isAdmin:', isAdminUser);
    };

    checkAdminStatus();
  }, []);

  function MainStack() {
    return (
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Restaurants" component={RestaurantScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Welcome' component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='editProfile' component={EditProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Restaurant info' component={RestaurantDetailsScreen} options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitle: 'Back',
          headerTitleStyle: {
            color: '#ccc',
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTintColor: '#F3EEEA',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <MaterialCommunityIcons name="arrow-left" size={24} color="#ccc" />
          ),
        }}  />
        <Stack.Screen name='Menu' component={MenuScreen} options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitle: 'Back',
          headerTitleStyle: {
            color: '#ccc',
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTintColor: '#ccc',
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <MaterialCommunityIcons name="arrow-left" size={24} color="#F3EEEA" />
          ),
        }} />
        {!isAdmin && (
          <Stack.Screen name='ReservationScreen' component={ReservationScreen} options={{
            headerShown: false,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTitle: 'Back',
            headerTitleStyle: {
              color: '#ccc',
              fontWeight: 'bold',
              fontSize: 18,
            },
            headerTintColor: '#ccc',
            headerBackTitleVisible: false,
            headerBackImage: () => (
              <MaterialCommunityIcons name="arrow-left" size={24} color="ccc" />
            ),
          }}/>
        )}
        <Stack.Screen name='profile' component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name='dashboard' component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name='login' component={ForgotPasswordScreen} options={{ headerShown: true}} />
      </Stack.Navigator>
    );
  }

  function TabNavigator() {
    
  
    return (
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: '#ccc',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen
          name="home"
          component={MainStack}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        {!isAdmin && (
          <Tab.Screen
            name="favourite"
            component={FavoriteRestaurantScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="heart" color={color} size={size} />
              ),
            }}
          />
        )}
        {!isAdmin && (
          <Tab.Screen
            name="reservation"
            component={PastReserevationScreen}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="book-open" color={color} size={size} />
              ),
            }}
          />
        )}
        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="account" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
