// I followed a tutorial to do this code: https://instamobile.io/mobile-development/react-native-firebase-storage/

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity, SafeAreaView, Text, StyleSheet, TextInput, View, Platform, Alert, Image } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign'
import * as ImagePicker from "react-native-image-picker"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-community/async-storage';
import { RSA } from 'react-native-rsa-native';
import { hammingDistance } from "hamming-distance-ts";

const UploadScreen = ({ navigation, route }) => {
    const [image, setImage] = useState(null);
    const [name, setName] = useState("")
    const [input, setInput] = useState("")
    const char ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    const user = auth().currentUser
    var lsname = [user.displayName, route.params.displayName]
    var docname = lsname.sort().toString()

    const selectImage = () => {
        const options = {
          storageOptions: {
            skipBackup: true,
            path: 'images'
          }
        };
        ImagePicker.launchImageLibrary(options, response => {
            if (response.didCancel) {
              console.log('User Cancelled');
            } else if (response.error) {
              console.log('Error: ', response.error);
            } else if (response.customButton) {
              console.log('User tapped custom button: ', response.customButton);
            } else if (response.uri) {
                setFilePath(response.uri)
                console.log('NO ASSET OBJECT FOUND: ', response.uri) }
            else {
              const source = { uri: response.assets[0].uri };
              setName(response.assets[0].uri)
              console.log(source);
              setImage(source);
            }
          });
    };

    useEffect(() => {
        const createSession = async () => {
            await firestore().collection('chats').doc(docname).set({
                chatName: docname
            })
        }
        return () => {
            createSession
        };
    }, []);

    const uploadImage = async () => {
        var hashDB = []
        var threshold = 0
        var count = 0
        var final = '';
        
        const charlength = char.length
        for (var j=0; j<7; j++) {
            final += char.charAt(Math.floor(Math.random() * charlength));
        }

        await firestore().collection('database').doc('hashes').get().then(hash => {
            hashDB = hash.data().array;
            for (var i=0; i<hashDB.length; i++){
                threshold = hammingDistance(input, hashDB[i])
                console.log('threshold',threshold)
                if (threshold <= 20){
                    count+=1
                }
            }
        });
        if (count>0){
            let newFinal = final + 'FlagForInspection'
            firestore().collection('chats').doc(docname).collection('messages').doc(newFinal).set({
                timestamp: firebase.firestore.Timestamp.now(),
                displayName: auth().currentUser.displayName,
                email: auth().currentUser.email,
                message: "illegal",
                docname: newFinal,
                notification: 'An illegal image has been sent'
            }).then(navigation.goBack )
        } else {
            var final = '';
        
            const charlength = char.length
            for (var j=0; j<7; j++) {
                final += char.charAt(Math.floor(Math.random() * charlength));
            }

            const base64Image = await RNFS.readFile( name, 'base64')

            const pkey = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.public'))
            const publickey = JSON.parse(pkey)

            const publickey1 = route.params.publickey12

            const arrayPlaintext = []
            const arrayEncryptedSender = []
            const arrayEncryptedReceiver = []

            let newArray = base64Image.split('');

            const size = Math.ceil(base64Image.length/250)

            for (let i=0; i<size; i++){
                let bits = (newArray.splice(0,249)).join("")
                arrayPlaintext.push(bits)
            }

            console.log('arrayPlaintext')

            for (let i=0; i<size; i++){
                let senderEncrypt = await RSA.encrypt((arrayPlaintext[i]), publickey)
                arrayEncryptedSender.push(senderEncrypt)
                arrayEncryptedReceiver.push(await RSA.encrypt(JSON.stringify(arrayPlaintext[i]), publickey1))
            }

            console.log('firestore', console.log(arrayEncryptedSender.length))

            firestore().collection('chats').doc(docname).collection('messages').doc(final).set({
                timestamp: firebase.firestore.Timestamp.now(),
                gestmessage: "",
                messageSender: "Image Could Not Be Shown At This Time",
                messageReceiver: "Image Could Not Be Shown At This Time",
                arrayEncryptedSender: arrayEncryptedSender,
                arrayEncryptedReceiver: arrayEncryptedReceiver,
                displayName: auth().currentUser.displayName,
                hidden: "None",
                emergency: "No",
                email: auth().currentUser.email,
                mode: "",
                message: "isImage",
                docname: final
            }).then(navigation.goBack )
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Upload Image",
            headerLeft: () => (
                <TouchableOpacity 
                    style={{ marginLeft: 10 }}
                    onPress={ navigation.goBack }
                >
                    <AntDesign name="arrowleft" size={24}color="white" />
                </TouchableOpacity>
            )
        })
    }, [navigation])

    
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.selectButton} onPress={selectImage}>
                <Text style={styles.buttonText}>Select</Text>
            </TouchableOpacity>
            <View style={styles.imageContainer}>
            {image !== null ? (
                <Image source={{ uri: image.uri }} style={styles.imageBox} />
            ) : null}
            { 
                <>
                    <TextInput 
                        value={input}
                        onChangeText={(text) => setInput(text)} 
                        onSubmitEditing={uploadImage}
                        placeholder="Type message here" 
                        style={styles.textInput} 
                    />
                    <TouchableOpacity style={styles.button2} onPress={uploadImage}>
                        <Text style={styles.buttonText}>Verify</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={styles.uploadButton} onPress={success}>
                        <Text style={styles.buttonText}>Upload</Text>
                    </TouchableOpacity> */}
                </>
            }
            </View>
        </SafeAreaView>
    );
}

export default UploadScreen

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems : "center",
        justifyContent: "center",
        padding: 10,
        backgroundColor: "white",
    },
    textInput: {
        height: 50,
        margin: 12,
        width: 300,
        borderWidth: 1,
        padding: 15,
        alignItems: 'center',
      },
    selectButton: {
        marginTop: 50,
        borderRadius: 3,
        width: 150,
        height: 50,
        backgroundColor: '#8ac6d1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#957dad',
        width: 300,
        marginTop: 10,
    },
    uploadButton: {
        borderRadius: 3,
        width: 150,
        height: 50,
        backgroundColor: '#ffb6b9',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 15,
        backgroundColor: '#d291bc',
        width: 300,
        marginBottom: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    imageContainer: {
        marginTop: 30,
        marginBottom: 50,
        alignItems: 'center'
    },
    progressBarContainer: {
        marginTop: 20
    },
    imageBox: {
        width: 300,
        height: 300
    },
    button2:{
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#e0bbe4',
        width: 300,
        marginTop: 10,
    }
  });

