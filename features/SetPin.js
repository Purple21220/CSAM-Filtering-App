// I used https://www.npmjs.com/package/@haskkor/react-native-pincode to get the react native pincode function and its built in functions

import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PINCode from '@haskkor/react-native-pincode'

const SetPin = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Set Pin",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const Change = () => {
        navigation.navigate("Register")
    }

    return (
        <View style={styles.container}>
            <PINCode 
                status={'choose'}
                finishProcess={Change}
            />

        </View>
    )
}

export default SetPin

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white",
        padding: 30,
        height: "100%"
    }
})

