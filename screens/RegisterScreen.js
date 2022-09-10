// I followed a tutorial to do this code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&ab_channel=SonnySangha

import React, { useLayoutEffect, useState } from 'react'
import { Button, Text, Input } from 'react-native-elements'
import { View, KeyboardAvoidingView, StyleSheet, PermissionsAndroid } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'
import { ScrollView } from 'react-native-gesture-handler'
import { RSA, RSAKeychain } from 'react-native-rsa-native';
import AsyncStorage from '@react-native-community/async-storage'

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [imageUrl, setImageUrl] = useState("")
    
    useLayoutEffect (() => {
        navigation.setOptions({
            headerBackTitle: "Return to Login",
        })
    }, [navigation])

    const requestPermission = async () => {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Get Read External Storage Access',
            message: 'get read external storage access for detecting screenshots',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
      };

    const register = async (e) => {
        await AsyncStorage.clear()
        const keys = await RSA.generateKeys(4096)
        var name1 = name + ".private"
        var name2 = name + ".public"
        // code taken from https://blog.jscrambler.com/how-to-use-react-native-asyncstorage/
        await AsyncStorage.setItem(JSON.stringify(name1), JSON.stringify(keys.private))
        await AsyncStorage.setItem(JSON.stringify(name2), JSON.stringify(keys.public))

        var hashData = []
        hashData.push('1001000110111110010010011000101001001011110111011110110011001101')

        auth()
        .createUserWithEmailAndPassword(email,password)
        .then(authUser => {
            authUser.user.updateProfile({
                displayName: name,
                photoURL: 
                    imageUrl || 
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=200&q=100", 
            }),
            firestore()
            .collection('database')
            .doc('hashes')
            .set({
                array: hashData
            }),
            firestore()
            .collection('users')
            .doc(auth().currentUser.displayName)
            .set({
                displayName: name,
                photoURL: 
                    imageUrl || 
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=200&q=100", 
                email:email,
                userId:auth().currentUser.uid,
                publickey: keys.public
            })
        })
        .catch((error)=>alert(error.message))
    }

    return (
        <ScrollView>
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <Text h3 style={{marginBottom:50}}>
                    Create an Account
                </Text>
                <View style={styles.inputContainer}>
                    <Input 
                        placeholder="Full Name" 
                        autofocus 
                        type="text" 
                        value={name}
                        onChangeText={(text) => setName(text)} 
                    />
                    <Input 
                        placeholder="Email"  
                        type="email" 
                        value={email}
                        onChangeText={(text) => setEmail(text)} 
                    />
                    <Input 
                        placeholder="Password"  
                        type="password" 
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => setPassword(text)} 
                    />
                    <Input 
                        placeholder="Profile Picture (optional)"  
                        type="email" 
                        value={imageUrl}
                        onChangeText={(text) => setImageUrl(text)} 
                        onSubmitEditing={register}
                    />
                </View>

                <Button 
                    onPress={() => navigation.navigate("SetPin")} 
                    title="Click here to set your pin" 
                    raised
                    containerStyle={styles.button}
                />
                <Button
                    onPress={requestPermission} 
                    title="Request Permission" 
                    raised
                    containerStyle={styles.button}
                />

                <Button 
                    onPress={register} 
                    title="Register" 
                    raised
                    containerStyle={styles.button}
                />
                <View style={{ height: 100 }} />
            </KeyboardAvoidingView>
        </ScrollView>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems : "center",
        justifyContent: "center",
        padding: 20,
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
})
