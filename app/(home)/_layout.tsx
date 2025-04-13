import {Redirect, Stack} from "expo-router";
import ChatProvider from "@/providers/ChatProvider";
import {useAuth} from "@/providers/AuthProviders";
import React from "react";

const HomeLayout = () => {
    const {user} = useAuth()

    if(!user){
        return <Redirect href={'/(auth)/signup/confirmSignUp'} />;
    }

    return (
                <ChatProvider>
                    <Stack>
                        <Stack.Screen
                            name="(tabs)"
                            options={{ headerShown: false }}
                        />
                    </Stack>
                </ChatProvider>
    )
}
export default HomeLayout
