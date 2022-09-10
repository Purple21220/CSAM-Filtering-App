// I used https://www.npmjs.com/package/@haskkor/react-native-pincode to get the react native pincode function and its built in functions

import React, { useLayoutEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import PINCode from '@haskkor/react-native-pincode'

const EnterPin = ({ navigation,route }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Enter Pin",
            headerBackTitle: "Chats"
        })
    }, [navigation])

    const onChange = () => {
        var msg = route.params.hid
        console.log("super duper")
        console.log(msg)
        navigation.navigate('Open',{hid:msg})
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

export default EnterPin

const styles = StyleSheet.create({
    container:{
        backgroundColor: "white",
        padding: 30,
        height: "100%"
    }
})

