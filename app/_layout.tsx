import { Redirect, Stack } from "expo-router";
import './globals.css';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import AuthProvider from "@/providers/AuthProviders";
import VideoProvider from "@/providers/VideoProviders";
import CallProvider from "@/providers/CallProvider"; // <-- import your CallProvider
import React from "react";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Dortmund-ExtraBold': require('../Assets/Fonts/Dortmund-ExtraBold.otf'),
  });

  if (!fontsLoaded) {
    return null; // Or a loading component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        <StatusBar />
        <AuthProvider>
          <VideoProvider>
            <CallProvider> {/* <-- Wrap here to listen/manage calls globally */}
              <Stack>
                <Stack.Screen
                  name="(home)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(auth)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(buddy)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </CallProvider>
          </VideoProvider>
        </AuthProvider>
      </>
    </GestureHandlerRootView>
  );
}
