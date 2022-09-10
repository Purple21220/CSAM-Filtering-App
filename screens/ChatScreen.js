// I followed a tutorial to do this code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&ab_channel=SonnySangha

import React, { useLayoutEffect, useState,useEffect } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight, View, Image } from 'react-native'
import { Avatar,Button } from 'react-native-elements'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import firebase from 'firebase'
import { addScreenshotListener, removeScreenshotListener } from 'react-native-detector';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import AsyncStorage from '@react-native-community/async-storage';
import { RSA } from 'react-native-rsa-native';

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [decode, setDecoded] = useState("")
    const [decryptBase, setDecryptBase] = useState("")

    const user = auth().currentUser
    var lsname = [user.displayName, route.params.displayName]
    var docname = lsname.sort().toString()

    var encodedMessageS = ""
    var encodedMessageR = ""
    var decodedMessageS = ""

    const sendMessage = async() => {
        
        Keyboard.dismiss()
        const pkey = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.public'))
        const publickey = JSON.parse(pkey)
        encodedMessageS = await RSA.encrypt(JSON.stringify(input), publickey)

        const publickey1 = route.params.publickey12
        encodedMessageR = await RSA.encrypt(JSON.stringify(input), publickey1)

        firestore().collection('chats').doc(docname).collection('messages').doc(input).set({
            timestamp: firebase.firestore.Timestamp.now(),
            messageSender: encodedMessageS,
            messageReceiver: encodedMessageR,
            gestmessage: "",
            displayName: auth().currentUser.displayName,
            hidden: "None",
            emergency: "No",
            email: auth().currentUser.email,
            photoURL: auth().currentUser.photoURL,
            mode: "",
            message: input
        })
        setInput("")
        const try4 = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.private'))
        const try2 = JSON.parse(try4)
        decodedMessageS = await RSA.decrypt(encodedMessageS, try2)
        setDecoded(JSON.parse(decodedMessageS))
    }

    const deletemsg = (msg) => {
        firestore().collection('chats').doc(docname).collection('messages').doc(msg).update({
            message: "User deleted message",
        })
    }

    const emergency = (msg) => {
        firestore().collection('chats').doc(docname).collection('messages').doc(msg).update({
            displayName: auth().currentUser.displayName,
            emergency: "Yes",
        })

    }

    const hiddenmsg = async() => {
        Keyboard.dismiss()
        const pkey = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.public'))
        const publickey = JSON.parse(pkey)
        encodedMessageS = await RSA.encrypt(JSON.stringify(input), publickey)

        const publickey1 = route.params.publickey12
        encodedMessageR = await RSA.encrypt(JSON.stringify(input), publickey1)

        firestore().collection('chats').doc(docname).collection('messages').doc(input).set({
            timestamp: firebase.firestore.Timestamp.now(),
            messageSender: encodedMessageS,
            messageReceiver: encodedMessageR,
            gestmessage: "",
            displayName: auth().currentUser.displayName,
            hidden: "Yes",
            emergency: "No",
            email: auth().currentUser.email,
            photoURL: auth().currentUser.photoURL,
            mode: "",
            message: "Tap to view"
        })
    }

    const destruct = async() => {
        Keyboard.dismiss()
        const pkey = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.public'))
        const publickey = JSON.parse(pkey)
        encodedMessageS = await RSA.encrypt(JSON.stringify(input), publickey)

        const publickey1 = route.params.publickey12
        encodedMessageR = await RSA.encrypt(JSON.stringify(input), publickey1)
        firestore().collection('chats').doc(docname).collection('messages').doc(input).set({
            timestamp: firebase.firestore.Timestamp.now(),
            messageSender: encodedMessageS,
            messageReceiver: encodedMessageR,
            gestmessage: "",
            displayName: auth().currentUser.displayName,
            hidden: "None",
            emergency: "No",
            email: auth().currentUser.email,
            photoURL: auth().currentUser.photoURL,
            mode: "",
            message: input
        })
        .then(
            // Taken the setTimeout function from https://stackoverflow.com/questions/34504322/settimeout-in-react-native
            setTimeout(() => {
                firestore().collection('chats').doc(docname).collection('messages').doc(input).update({
                    message: "destruction",
            })}, 10000)
        )
    }

    const sessionStart = (id, displayName, gid, publickey) => {
        navigation.navigate("ChatScreenGuest", ({
            id,
            displayName,
            uid: gid,
            publickey12: publickey
            
        }))
    }

    const sendImage = () => {
        navigation.navigate("Upload", ({
            id: route.params.id,
            displayName: route.params.displayName,
            publickey: route.params.publickey,
            publickey12: route.params.publickey12,
        }))
    }

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

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chat",
            headerBackTitleVisible: false,
            headerTitleAlign: "left",
            headerTitle: () => (
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center"
                    }}
                >
                    <Avatar 
                        rounded 
                        source={{
                            uri: messages[(messages).length-1]?.data.photoURL  
                                // || "/Users/natashatanhui-jun/Desktop/trial3.png"
                        }} />
                    <Text style={{ color: "navy", marginLeft:10, fontWeight: "700" }} 
                    >
                        {route.params.displayName}
                    </Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity 
                    style={{ marginLeft: 10 }}
                    onPress={ navigation.goBack }
                >
                    <AntDesign name="arrowleft" size={24}color="white" />
                </TouchableOpacity>
            )
        })
    }, [navigation, messages])

    useEffect(() => {
        const userDidScreenshot = () => {
            firestore().collection('chats').doc(docname).collection('messages').add({
                timestamp: firebase.firestore.Timestamp.now(),
                message: "User took a screenshot",
                gestmessage: "",
                displayName: auth().currentUser.displayName,
                hidden: "None",
                emergency: "No",
                email: auth().currentUser.email,
                photoURL: auth().currentUser.photoURL,
                mode: ""
            })
        };
        const listener = addScreenshotListener(userDidScreenshot);
        return () => {
          removeScreenshotListener(listener);
        };
    }, []);


    useEffect(() => {
        var try4
        var try2
        var named 
        var decodedMessageS1
        {messages.map(async({id, data}) => (
            <>{data.displayName === user.displayName
                ?(
                    try4 = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.private')),
                    try2 = JSON.parse(try4),
                    decodedMessageS1 = await RSA.decrypt(data.messageSender, try2),
                    decodedMessageS = JSON.parse(decodedMessageS1),
                    firestore().collection('chats').doc(docname).collection('messages').doc(decodedMessageS).update({
                        messageSender: decodedMessageS
                    }),
                    named = decodedMessageS + "mess",
                    setDecoded(named)
                )
                :data.displayName !== user.displayName
                ?(
                    try4 = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.private')),
                    try2 = JSON.parse(try4),
                    decodedMessageS1 = await RSA.decrypt(data.messageReceiver, try2),
                    decodedMessageS = JSON.parse(decodedMessageS1),
                    firestore().collection('chats').doc(docname).collection('messages').doc(decodedMessageS).update({
                        messageReceiver: decodedMessageS
                    }),
                    named = decodedMessageS + "ouse",
                    setDecoded(named)
                )
                :null
            }</>
        ))}
    }, [decode, decode])

    const decryptArray = async(key, array) => {
        console.log("decrypting")
        var decryptBase64 = ''
        for (let i=0; i<array.length; i++){
            let decrypted = await RSA.decrypt((array[i]), key)
            decryptBase64+=decrypted
            console.log(decryptBase64)
        }
        console.log(decryptBase64)
        setDecryptBase(decryptBase64)
        return decryptBase64
    };

    useEffect(() => {
        var try4
        var try2
        var named 
        var decodedMessageS1
        var decryptedBase64
        {messages.map(async({id, data}) => (
            <>{data.displayName === user.displayName && data.arrayEncryptedSender != 'decrypted'
                ?(
                    try4 = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.private')),
                    try2 = JSON.parse(try4),
                    decryptedBase64 = await decryptArray(try2, data.arrayEncryptedSender),
                    firestore().collection('chats').doc(docname).collection('messages').doc(data.docname).update({
                        arrayEncryptedSender: 'decrypted',
                        messageSender: decryptedBase64
                    }),
                    named = decodedMessageS + "mess",
                    setDecoded(named)
                )
                :data.displayName !== user.displayName && data.arrayEncryptedReceiver != 'decrypted'
                ?(
                    try4 = await AsyncStorage.getItem(JSON.stringify(user.displayName+'.private')),
                    try2 = JSON.parse(try4),
                    decryptedBase64 = await decryptArray(try2, data.arrayEncryptedReceiver),
                    firestore().collection('chats').doc(docname).collection('messages').doc(data.docname).update({
                        arrayEncryptedReceiver: 'decrypted',
                        messageReceiver: decryptedBase64
                    }),
                    named = decodedMessageS + "ouse",
                    setDecoded(named)
                )
                :null
            }</>
        ))}
    }, [decode, decode])

    useLayoutEffect(() => {
        const unsubscribe = firestore()
            .collection('chats')
            .doc(docname)
            .collection('messages')
            .orderBy('timestamp.seconds', 'asc')
            .onSnapshot(snapshot => setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                }))
            ))
        return unsubscribe
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fffef2" }} >
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height" }  
                style={styles.container}
                keyboardVerticalOffset={90}  
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                    <ScrollView contentContainerStyle={{ paddingTop: 15 }} >
                        {messages.map(({id, data}) => (
                            data.email == auth().currentUser.email ? (
                                <View>
                                    {data.message==='User took a screenshot' 
                                    ?<View style={styles.scre}>
                                        <Text>{data.displayName} {data.mode} took a screenshot</Text>
                                    </View>
                                    :
                                    data.emergency === 'Yes'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.emerge}>{data.displayName} {data.mode} has declared this message as an emergency:</Text>
                                        <Text>{data.messageSender}</Text>
                                    </View>
                                    :
                                    data.message === 'Create Session'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text>{data.displayName} {data.mode} {data.gestmessage}</Text>
                                    </View>
                                    :
                                    data.message === 'User deleted message'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>{data.displayName} deleted the message</Text>
                                    </View>
                                    :
                                    data.message === 'isImage'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>{data.displayName} sent an image</Text>
                                        <Image style={{width: 300, height: 300}} resizeMode = "contain" source={{uri: `data:image/gif;base64,${data.messageSender}`}} />
                                    </View>
                                    :
                                    data.message === 'illegal'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>{data.displayName} sent an image</Text>
                                        <Text style={styles.del}>{data.notification}</Text>
                                    </View>
                                    :
                                    data.message === 'Tap to view'
                                    ?<View style={styles.receiver}>
                                        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("EnterPin",({id, hid: data.messageSender}))}>
                                            <Text style={{color: '#0e2433', fontWeight: "700"}}>Tap to View</Text>
                                        </TouchableHighlight>
                                    </View>
                                    :
                                    data.message === 'destruction'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.des}>Dissapearing message by {data.displayName} has come to an end</Text>
                                    </View>
                                    :
                                    data.mode === "'s guest"
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <View key={id} style={styles.receiver1} >
                                            <Avatar
                                                position="absolute"
                                                rounded
                                                // WEB
                                                containerStyle={{
                                                    position: "absolute",
                                                    bottom: -15,
                                                    right: -5
                                                }}
                                                bottom={-15}
                                                right={-5}
                                                size={30}
                                                source={{
                                                    uri: data.photoURL
                                                }}
                                            />
                                            <Menu>
                                                <MenuTrigger>
                                                    <Text>{data.messageSender}</Text>
                                                </MenuTrigger>
                                                <MenuOptions customStyles={{optionWrapper: { padding: 0}, optionText: styles.text, maxHeight: 200}}>
                                                    <MenuOption onSelect={() => deletemsg(data.messageSender)} text="Delete for All" />
                                                    <MenuOption onSelect={() => emergency(data.messageSender)} text="Declare Emergency" />
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    </View>
                                    :
                                    <View key={id} style={styles.receiver} >
                                        <Avatar
                                            position="absolute"
                                            rounded
                                            // WEB
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                right: -5
                                            }}
                                            bottom={-15}
                                            right={-5}
                                            size={30}
                                            source={{
                                                uri: data.photoURL
                                            }}
                                        />
                                        <Menu>
                                            <MenuTrigger>
                                                <Text>{data.messageSender}</Text>
                                            </MenuTrigger>
                                            <MenuOptions customStyles={{optionWrapper: { padding: 0}, optionText: styles.text, maxHeight: 200}}>
                                                <MenuOption onSelect={() => deletemsg(data.messageSender)} text="Delete for All" />
                                                <MenuOption onSelect={() => emergency(data.messageSender)} text="Declare Emergency" />
                                                {/* <MenuOption onSelect={() => retrieve(data.message)} text="Click to decrypt" /> */}
                                            </MenuOptions>
                                        </Menu>
                                    </View>}
                                </View>
                            ): (
                                <View>
                                    {data.message==='User took a screenshot' 
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.scre}>{data.displayName} {data.mode} took a screenshot</Text>
                                    </View>
                                    :
                                    data.message === "Create Session"
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text>{data.displayName} {data.mode} {data.gestmessage}</Text>
                                        <TouchableHighlight style={styles.button1} onPress={() => {sessionStart(data.id, data.displayName, data.gid, route.params.publickey12)}}>
                                            <Text style = {styles.sesh}>Click here to chat with {data.displayName} {data.mode}</Text>
                                        </TouchableHighlight>
                                    </View>
                                    :
                                    data.message === 'isImage'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>{data.displayName} sent an image</Text>
                                        <Image style={{width: 300, height: 300}} resizeMode = "contain" source={{uri: `data:image/gif;base64,${data.messageReceiver}`}} />
                                    </View>
                                    :
                                    data.message === 'illegal'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>{data.displayName} sent an image</Text>
                                        <Text style={styles.del}>{data.notification}</Text>
                                    </View>
                                    :
                                    data.emergency === 'Yes'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.emerge}>{data.displayName} {data.mode} has declared this message as an emergency:</Text>
                                        <Text>{data.message}</Text>
                                    </View>
                                    :
                                    data.message === 'destruction'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.del}>Dissapearing message by {data.displayName} has come to an end</Text>
                                    </View>
                                    :
                                    data.message === 'User deleted message'
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <Text style={styles.des}>{data.displayName} deleted the message</Text>
                                    </View>
                                    :
                                    data.message === 'Tap to view'
                                    ?<View style={styles.sender}>
                                        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("EnterPin",({hid: data.messageReceiver}))}>
                                            <Text style={{color: '#0e2433', fontWeight: "700"}}>Tap to View</Text>
                                        </TouchableHighlight>
                                    </View>
                                    :
                                    data.mode === "'s guest"
                                    ?<View style={{alignItems:'center', padding:20}}>
                                        <View key={id} style={styles.sender1}>
                                            <Avatar
                                                position="absolute"
                                                rounded
                                                // WEB
                                                containerStyle={{
                                                    position: "absolute",
                                                    bottom: -15,
                                                    left: -5
                                                }}
                                                bottom={-15}
                                                right={-5}
                                                size={30}
                                                source={{
                                                    uri: data.photoURL
                                                }}
                                            />
                                            <Text style={styles.senderName}> {data.displayName} </Text>
                                            <Menu>
                                                <MenuTrigger>
                                                    <Text style={styles.senderText}> {data.messageReceiver} </Text>
                                                </MenuTrigger>
                                                <MenuOptions customStyles={{optionWrapper: { padding: 3}, optionText: styles.text, maxHeight: 200}}>
                                                    <MenuOption onSelect={() => emergency(data.messageReceiver)} text="Declare Emergency" />    
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    </View>
                                    :
                                    <View key={id} style={styles.sender}>
                                        <Avatar
                                            position="absolute"
                                            rounded
                                            // WEB
                                            containerStyle={{
                                                position: "absolute",
                                                bottom: -15,
                                                left: -5
                                            }}
                                            bottom={-15}
                                            right={-5}
                                            size={30}
                                            source={{
                                                uri: data.photoURL
                                            }}
                                        />
                                        <Text style={styles.senderName}> {data.displayName} </Text>
                                        <Menu>
                                            <MenuTrigger>
                                                <Text style={styles.senderText}> {data.messageReceiver} </Text>
                                            </MenuTrigger>
                                            <MenuOptions customStyles={{optionWrapper: { padding: 3}, optionText: styles.text, maxHeight: 200}}>
                                                <MenuOption onSelect={() => emergency(data.messageReceiver)} text="Declare Emergency" />    
                                            </MenuOptions>
                                        </Menu>
                                    </View>}
                                </View>
                            )
                        ))}  
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                            value={input}
                            onChangeText={(text) => setInput(text)} 
                            onSubmitEditing={sendMessage}
                            placeholder="Type message here" 
                            style={styles.textInput} 
                        />
                        <TouchableOpacity onPress={sendMessage} activeOpacity={0.5} style={styles.button} >
                            <Ionicons name="send" size={24} color = "#0066ce" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={hiddenmsg} activeOpacity={0.5} style={styles.button} >
                            <Ionicons name="timer" size={26} color = "#0066ce" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={destruct} activeOpacity={0.5} style={styles.button} >
                            <FontAwesome name="bomb" size={24} color = "#0066ce" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendImage} activeOpacity={0.5} style={styles.button}>
                            <FontAwesome name="image" size={24}color="#0066ce" />
                        </TouchableOpacity>
                    </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 10
    },
    receiver: {
        padding: 20,
        backgroundColor: "#dcedc2",
        alignSelf: "flex-end",
        borderRadius: 10,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    receiver1: {
        padding: 20,
        backgroundColor: "#f67280",
        alignSelf: "flex-end",
        borderRadius: 10,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: "80%",
        position: "relative"
    },
    sender: {
        padding: 20,
        backgroundColor: "#a8e6ce",
        alignSelf: "flex-start",
        borderRadius: 10,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    sender1: {
        padding: 20,
        backgroundColor: "#6c5b7b",
        alignSelf: "flex-start",
        borderRadius: 10,
        margin: 15,
        maxWidth: "80%",
        position: "relative"
    },
    senderText: {
        color: "white",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    },
    receiverText: {
        color: "black",
        fontWeight: "500",
        marginLeft: 10,
        marginBottom: 15
    },
    senderName:{
        left: 0,
        paddingRight: 10,
        fontSize: 10,
        fontWeight: "200",
        color: "white"
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: "white",
        padding: 10,
        color: "black",
        borderRadius: 30
    },
    emerge:{
        alignItems: "center",
        justifyContent: "center",
        color: "red",
        padding:10,
    },
    sesh:{
        alignItems: "center",
        justifyContent: "center",
        color: "brown",
        padding:10,
    },
    del:{
        color: "blue",
        alignItems:'center', 
        justifyContent: "center",
        padding:10,
    },
    des:{
        color: "grey",
        alignItems:'center', 
        justifyContent: "center",
        padding:10,
    },
    scre:{
        alignItems: "center",
        justifyContent: "center",
        color: "purple",
        padding:10,
    },
    button:{
        borderRadius: 3,
        marginBottom: 15,
        padding: 5,
    },
    button1:{
        alignItems: "center",
        borderRadius: 3,
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#e0bbe4',
    },
    imageBox: {
        width: 300,
        height: 300
    }
})
