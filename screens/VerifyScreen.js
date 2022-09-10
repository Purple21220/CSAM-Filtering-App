import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native'
import TouchID from 'react-native-touch-id'
import auth from '@react-native-firebase/auth';

const VerifyScreen = ({ navigation }) => {
    const [supported, setSupported] = useState(false)

    const user = auth().currentUser

    // taken from https://github.com/naoufal/react-native-touch-id
    useEffect(() => {
        TouchID.isSupported()
        .then(success => {
            setSupported(true)
          })
          .catch(error => {
            alert(error)
            console.log("FAIL")
          })
    },[])

    return (
        <View style ={styles.container}>
            <Text style={{color: '#0e2433', padding: 5, fontSize: 25}}>Hey there! Welcome back!</Text>
            <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("EnterPinLogin")}>
                <Text style={{color: '#0e2433', fontWeight: "700"}}>Please Click Here to Sign In</Text>
            </TouchableHighlight>
            <Text style={{color: '#0e2433', padding: 5, fontSize: 25}}>Not you?</Text>
            <TouchableHighlight style={styles.button1} onPress={() => auth().signOut().then(()=> {navigation.replace("Login")})}>
                <Text style={{color: '#0e2433', fontWeight: "700"}}>Click here to Logout and go back to Login</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button2} onPress={() => navigation.navigate("HomeScreenGuest")}>
                <Text style={{color: '#0e2433', fontWeight: "700"}}>Click here for Guest Mode</Text>
            </TouchableHighlight>
        </View>
    )
}

export default VerifyScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems : "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    button:{
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#e0bbe4',
        width: 300,
        marginTop: 10,
    },
    button1:{
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#957dad',
        width: 300,
        marginTop: 10,
    },
    button2:{
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#d291bc',
        width: 300,
        marginTop: 10,
    }
})