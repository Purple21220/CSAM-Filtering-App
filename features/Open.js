import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View,KeyboardAvoidingView, TouchableHighlight,Dimensions } from 'react-native'

const Open = ({ navigation, route }) => {
    const {height, width} = Dimensions.get('window');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Hidden Message",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const onChange = () => {
        console.log("scooby doo")
        navigation.navigate('Chat')
    }

    return (
        <View style={styles.container}>
            <Text style={{color: '#0e2433', padding: 15, fontSize: 25}}>{route.params.hid}</Text>
            <TouchableHighlight style={styles.button} onPress={onChange}>
                <Text style={{color: '#0e2433', fontWeight: "700", justifyContent: "center"}}>Please Click Here When Done Reading</Text>
            </TouchableHighlight>
        </View>
    )
}

export default Open

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white",
        padding: 30,
        height: "100%",
        alignItems : "center",
        justifyContent: "center",
    },
    button:{
        borderRadius: 3,
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#e0bbe4',
        width: 300,
        marginTop: 10,
    },
})

