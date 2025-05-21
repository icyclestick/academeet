import {View, Text} from 'react-native'
import React from 'react'
import {Stack} from "expo-router";

const _LayoutChannel = () => {
    return (
        <Stack>
            <Stack.Screen name='[cid]' options={{headerShown: false}}/>
        </Stack>
    )
}
export default _LayoutChannel
