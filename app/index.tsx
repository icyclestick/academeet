import {View, Text} from 'react-native'
import React from 'react'
import {Redirect} from "expo-router";

const IndexScreen = () => {
    // return <Redirect href={'/(home)/(tabs)'} />
    return <Redirect href={'/(auth)/login'} />
}
export default IndexScreen
