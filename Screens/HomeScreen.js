import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useState, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
    const [user, setUser] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const auth = getAuth();
       
    
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
          if (authUser) {
            setUser(authUser);
          } else {
            setUser(null);
          }
        });
    
        return () => unsubscribe();
      }, []);
    

  

  return (
      <View style={styles.container}>

          <View >
              <FontAwesome style={styles.circle} name="circle" size={700} color="#FFD700" />
          </View>

          <Image
              source={require('../assets/cartoon-1299636_1920.png')}
              style={{ width: 200, height: 265.56 }}
          />

          
          <Text style={styles.welcomeTxt}>Welcome!</Text>
          <Text style={styles.dineTxt}>Dine with your friends</Text>
          

          <View>
              <TouchableOpacity
                  style={styles.getButton}
                  onPress={() => {
                      if (user) {
                          navigation.navigate('Restaurants')
                      } else {
                          navigation.navigate('Login')
                      }
                  }}
              >
                  <Text style={styles.getTxt}>Get started</Text>

              </TouchableOpacity>
          </View>

      </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    circle: {
        position: 'absolute',
        top: -300, 
        left: -300, 
        zIndex: -1,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20, 
    },
    welcomeTxt: {
        fontSize: 64,
        fontFamily: 'italiana',
        marginTop: 100,
        color: '#FFD700',
    },
    dineTxt: {
        fontSize: 20,
        fontFamily: 'Nothing You Could Do',
        marginBottom: 150,
        color: '#ccc',
    },
    getButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFD700',
        width: 250,
        height: 60,
        borderRadius: 30,
       
        
    },
    getTxt: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
