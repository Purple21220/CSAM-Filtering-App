// I followed a tutorial to do this code: https://www.youtube.com/watch?v=MJzmZ9qmdaE&ab_channel=SonnySangha

import React, { useEffect, useLayoutEffect, useState } from 'react'
import { TouchableOpacity, SafeAreaView, Text, StyleSheet, ScrollView, View } from 'react-native'
import { Avatar, ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Entypo'


const HomeScreen = ({navigation}) => {
    const [chats, setChats] = useState ([])

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
            title: "KlikIt",
            headerStyle: { backgroundColor: "pink" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            headerLeft: () => (
            <View style={{ marginLeft: 20 }}>
                <TouchableOpacity onPress={signOutUser} activeOpacity={0.5}>
                    <Avatar rounded source={{ uri: auth()?.currentUser?.photoURL }} />
                </TouchableOpacity>
            </View>
            )
        })
    }, [navigation])

    const enterChat = (id, displayName, publickey) => {
        navigation.navigate("Chat", {
            id,
            displayName,
            publickey12: publickey
        })
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

export default HomeScreen

const styles = StyleSheet.create({
    container:{
        height: "100%"
    }
})

