import React, {PropsWithChildren, useEffect} from 'react'
import {StreamChat} from "stream-chat";
import {Chat, OverlayProvider} from "stream-chat-expo";
import {ActivityIndicator} from "react-native";
import {useAuth} from "@/providers/AuthProviders";
import {supabase} from "@/lib/supabase";

const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);

const ChatProvider = ({children}: PropsWithChildren) => {
    const [isReady, setIsReady] = React.useState(false);
    const {profile} = useAuth();

    useEffect(() => {
        if(!profile){
            return;
        }

        const connect = async () => {
            await client.connectUser(
                {
                    id: profile.id,
                    name: profile.full_name,
                    image: supabase.storage
                        .from('avatars')
                        .getPublicUrl(profile.avatar_url)
                        .data.publicUrl,
                },
                client.devToken(profile.id),
            );
            // const channel = client.channel("messaging", "the_park", {
            //     name: "The Park",
            // });
            // await channel.watch();
        }
        setIsReady(true)

        connect()

        return () => {
            client.disconnectUser();
            setIsReady(false)
        }
    }, [profile?.id]);

    if (!isReady) {
        return <ActivityIndicator />
    }
    return (
        <OverlayProvider>
            <Chat client={client}>
                {children}
            </Chat>
        </OverlayProvider>
    )
}
export default ChatProvider
