import {View} from 'react-native'
import React from 'react'
import {ChannelList} from "stream-chat-expo";
import {router} from "expo-router";

const Chat = () => {

    return (
        <View className="flex-1 bg-gray-100 w-full h-full:">
            <ChannelList onSelect={(channel) => router.push(`/channel/${channel.cid}`)}/>
        </View>
    )
}
export default Chat
