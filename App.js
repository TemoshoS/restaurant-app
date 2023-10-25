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
import store from './store/store';
import { Provider } from 'react-redux';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



export default function App() {

  function MainStack() {
    return (
      <Stack.Navigator initialRouteName='Restaurants'>
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
      <Tab.Navigator>
        <Tab.Screen name="Home" component={MainStack} options={{ headerShown: false }}/>
        <Tab.Screen name="Fav" component={RestaurantScreen} options={{ headerShown: false }}/>
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
