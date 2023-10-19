import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Navbar = () => {

    const getCurrentTimeOfDay = ()=>{

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
        <View>
            <View style={styles.user}>

                <Text style={styles.greetingText}>
                    Good {getCurrentTimeOfDay()}
                </Text>

                <Text style={styles.userText}>Temosho</Text>

            </View>
        </View>
    )
}

export default Navbar

const styles = StyleSheet.create({
    container:{

    },
    user:{
     flexDirection: 'row',
     alignItems: 'center',
     margin: 50
    },
    greetingText: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    userText:{
        marginLeft: 110,
    }
})