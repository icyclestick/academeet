import {Redirect, Stack} from "expo-router";
import ChatProvider from "@/providers/ChatProvider";
import {useAuth} from "@/providers/AuthProviders";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const HomeLayout = () => {
    const {user} = useAuth()

    if(!user){
        return <Redirect href={'/(auth)/login'} />;
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
                <ChatProvider>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
            </ChatProvider>
        </GestureHandlerRootView>
    )
}
export default HomeLayout
