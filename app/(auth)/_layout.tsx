import React from 'react'
import {Redirect, Stack} from "expo-router";
import {useAuth} from "@/providers/AuthProviders";

const AuthLayout = () => {
    const {user} = useAuth()

    if(user){
        return <Redirect href='/(home)/(tabs)' />;
    }
    return (
        <Stack screenOptions={{headerShown: false}}/>
    )
}
export default AuthLayout
