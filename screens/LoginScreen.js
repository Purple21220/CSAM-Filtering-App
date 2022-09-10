// I followed a tutorial to do this code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&ab_channel=SonnySangha

import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, StatusBar, StyleSheet, Text, View } from 'react-native'
import { Button, Input, Image } from "react-native-elements"
import auth from '@react-native-firebase/auth'
import { ScrollView } from 'react-native-gesture-handler'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged((authUser) => {
            if(authUser) {
                navigation.replace("Verify")
            }
        })
        return unsubscribe
    },[])

    const signIn = () => {
        auth().signInWithEmailAndPassword(email,password)
        .catch((error) => alert(error))
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView behavior='padding' style={styles.container}>
                <StatusBar style = 'light' />
                <Image 
                    source={{
                        uri:"https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=200&q=100",
                    }}
                    style={{ width: 200, height: 200 }}
                />
                {/* <Text>Please Login</Text> */}
                <View style = {styles.inputContainer}>
                    <Input placeholder="Email" 
                        autoFocus 
                        type="email"  
                        value={email}
                        onChangeText={(text => setEmail(text))}
                    />
                    <Input placeholder="Password" 
                        secureTextEntry 
                        type="password"
                        value={password}
                        onChangeText={(text => setPassword(text))} 
                        onSubmitEditing={signIn}
                    />
                </View>
                <Button containerStyle={styles.button} onPress={signIn} title="Login" />
                <Button 
                    onPress={() => navigation.navigate("Register")} 
                    containerStyle={styles.button} 
                    type="outline" 
                    title="Register" 
                />
                <View style={{ height: 100 }} />
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems : "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    inputContainer: {
        width: 300,
        marginTop: 20,
    },
    button: {
        width: 200,
        marginTop: 10,
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
})
