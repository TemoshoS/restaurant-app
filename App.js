import { StyleSheet} from 'react-native';
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
import store from './store/store';
import { Provider } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteRestaurantScreen from './Screens/FavoriteRestaurantScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



export default function App() {

  function MainStack() {
    return (
      <Stack.Navigator initialRouteName='Register'>
        <Stack.Screen name="Restaurants" component={RestaurantScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Welcome' component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name='RestaurantDetailsScreen' component={RestaurantDetailsScreen} options={{headerShown: false}}/>
        <Stack.Screen name='MenuScreen' component={MenuScreen} options={{headerShown: false}}/>
        <Stack.Screen name='ReservationScreen' component={ReservationScreen} options={{headerShown: false}}/>
      
      </Stack.Navigator>
    );
  }

  function TabNavigator() {
    return (
      <Tab.Navigator 
      tabBarOptions={{
        activeTintColor: '#808080',
        inactiveTintColor: '#AFEEEE',
        
      }}
     
      >
        <Tab.Screen 
        name=" " 
        component={MainStack} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={color}
              size={size}
              
            />
          ),
        }}
        />
        <Tab.Screen 
        name="  " 
        
        component={FavoriteRestaurantScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart"
              color={color}
              size={size}
            />
          ),
        }}/>
        <Tab.Screen 
        name="   " 
        component={PastReserevationScreen} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open"
              color={color}
              size={size}
            />
          ),
        }}/>
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});
