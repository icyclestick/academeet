import { Stack } from "expo-router";
import './globals.css'
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {StatusBar} from "react-native";

export default function RootLayout() {
  return <GestureHandlerRootView style={{ flex: 1 }}>
    <>
      <StatusBar/>
      <Stack>
        <Stack.Screen
          name="(home)"
          options={{ headerShown: false }}
        />
      </Stack>
    </>
  </GestureHandlerRootView>;
}
