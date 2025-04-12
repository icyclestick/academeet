import {Redirect, Stack} from "expo-router";
import './globals.css'
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StatusBar} from "react-native";
import AuthProvider from "@/providers/AuthProviders";
import React from "react";

export default function RootLayout() {


  return <GestureHandlerRootView style={{ flex: 1 }}>
    <>
      <StatusBar/>
      <AuthProvider>
        <Stack>
          <Stack.Screen
            name="(home)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
              name="(auth)"
              options={{ headerShown: false }}
          />
        </Stack>
        </AuthProvider>
    </>
  </GestureHandlerRootView>;
}
