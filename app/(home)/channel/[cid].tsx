import {View, Text, ActivityIndicator, SafeAreaView} from 'react-native'
import React, {useEffect, useState} from 'react'
import {useLocalSearchParams} from "expo-router";
import {Channel as ChannelType} from 'stream-chat'
import {Channel, MessageInput, MessageList, useChatContext} from "stream-chat-expo";

const Cid = () => {
    const [channel, setChannel] = useState<ChannelType | null>(null)

    const {cid} = useLocalSearchParams<{cid: string}>()

    const {client} = useChatContext()

    useEffect(() => {
        const fetchChannel = async () => {
            const channels = await client.queryChannels({cid})
            setChannel(channels[0])
        }

        fetchChannel()
    }, [cid]);

    if(!channel){
        return <ActivityIndicator />
    }

    return (
        <Channel channel={channel} >
            <MessageList />
            <SafeAreaView>
             <MessageInput />
            </SafeAreaView>
        </Channel>
    )
}
export default Cid
