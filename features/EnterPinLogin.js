// I used https://www.npmjs.com/package/@haskkor/react-native-pincode to get the react native pincode function and its built in functions

import React, { useLayoutEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PINCode from '@haskkor/react-native-pincode'

const EnterPinLogin = ({ navigation,route }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Enter Pin",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const onChange = () => {
        console.log("super duper")
        navigation.navigate('Home')
    }


    return (
        <View style={styles.container}>
            <PINCode 
                status={'enter'}
                finishProcess={onChange}
            />

        </View>
    )
}

export default EnterPinLogin

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white",
        padding: 30,
        height: "100%"
    }
})

