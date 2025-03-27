import {Stack} from "expo-router";
import ChatProvider from "@/providers/ChatProvider";

const _Layout = () => {


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
export default _Layout
