import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity, SafeAreaView, Text, StyleSheet, ScrollView, View } from 'react-native'
import { Avatar, ListItem  } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Entypo'


const HomeScreenGuest = ({navigation}) => {
    const [chats, setChats] = useState ([])
    const char ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    const signOutUser =() => {
        navigation.replace("Verify")
    }

    useEffect(() => {
        const unsubscribe = firestore().collection('users').onSnapshot(snapshot => (
            setChats(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
            )
        )

        return unsubscribe
    } ,[])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "You are in Guest Mode",
            headerStyle: { backgroundColor: "#355c7d" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            headerLeft: () => (
            <View style={{ marginLeft: 20 }}>
                <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                    <Avatar rounded source={{ uri: auth()?.currentUser?.photoURL }} />
                </TouchableOpacity>
            </View>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: 80,
                        marginRight: 20,
                    }}
                >
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("AddChat")} 
                        activeOpacity ={0.5}
                    >
                        <Icon name="pencil" size={24} color="black"/>
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation])

    const enterChat = (id, displayName, publickey) => {
        // code taken from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
        var final = '';
        const charlength = char.length
        for (var j=0; j<7; j++) {
            final += char.charAt(Math.floor(Math.random() * charlength));
        }
        navigation.navigate("ChatScreenGuest", ({
            id,
            displayName,
            uid: final,
            publickey12: publickey
            
        }))
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container} >
                {chats.map(({ id, data: { displayName, publickey } }) => (
                    <ListItem  
                        key={id} 
                        onPress={() => enterChat(id, displayName, publickey)} 
                        bottomDivider 
                    >
                        <Avatar
                            rounded
                            source={{
                                uri: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=200&q=100"
                                // || "/Users/natashatanhui-jun/Desktop/trial1.png"
                            }}
                        />
                        <ListItem.Content>
                            <ListItem.Title style={{ fontWeight: "800" }}>
                                {displayName}
                            </ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))} 
            </ScrollView>
        </SafeAreaView>
    )
}

export default HomeScreenGuest

const styles = StyleSheet.create({
    container:{
        height: "100%"
    }
})

