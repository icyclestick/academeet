import {Stack} from "expo-router";
import ChatProvider from "@/providers/ChatProvider";

const buddyLayout = () => {
    return (
        <ChatProvider>
            <Stack screenOptions={{headerShown: false}}/>
        </ChatProvider>
    )
}
export default buddyLayout
