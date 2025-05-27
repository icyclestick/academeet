import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useAuth } from "@/providers/AuthProviders";
import { useChatContext, Channel, MessageInput, MessageList } from "stream-chat-expo";
import { Ionicons } from '@expo/vector-icons';
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

const Chat = () => {
    const { user } = useAuth();
    const { client } = useChatContext();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [channel, setChannel] = useState<ChannelType | null>(null);
    const [showSidebar, setShowSidebar] = useState(false);
    const [events, setEvents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const userId = user?.id;

    useEffect(() => {
        // Find the single conversation
        const findChannel = async () => {
            if (user?.id) {
                try {
                    setLoading(true);
                    const channels = await client.queryChannels({
                        members: { $in: [user.id] },
                        type: 'messaging'
                    }, {}, {
                        limit: 1
                    });
                    if (channels && channels.length > 0) {
                        setChannel(channels[0]);
                    } else {
                        setError("No conversation found");
                    }
                } catch (err) {
                    setError("Something went wrong");
                } finally {
                    setLoading(false);
                }
            } else {
                setError("User not authenticated");
                setLoading(false);
            }
        };
        findChannel();
    }, [user?.id, client]);

    // Fetch all events and tasks for the user (no date filtering, no adding)
    const fetchAllCalendarData = async (userId) => {
        if (!userId) return;
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("calendars")
                .select("*")
                .eq("user_id", userId);
            if (error) throw error;
            setEvents(data.filter(item => item.entry_type === 'event'));
            setTasks(data.filter(item => item.entry_type === 'task'));
        } catch (err) {
            console.error("Error fetching all calendar data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchAllCalendarData(userId);
    }, [userId]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <ActivityIndicator size="large" color="#503E74" />
                <Text className="mt-4 text-gray-600">Loading your conversation...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100 p-4">
                <Text className="text-red-500 text-center">{error}</Text>
                <Text className="text-gray-600 text-center mt-2">
                    Please try again later or contact support if the problem persists.
                </Text>
            </View>
        );
    }
    if (!channel) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-100">
                <Text className="text-gray-600">No conversation available</Text>
            </View>
        );
    }
    return (
        <>
            <SafeAreaView style={{ backgroundColor: 'white' }}>
                <View className="flex-row items-center p-4 bg-white border-b border-gray-200">
                    <Text style={{ fontWeight: 'bold', fontSize: 20, flex: 1 }}>
                        {(() => {
                            if (channel.data?.name) return channel.data.name;
                            if (channel.data?.members && user?.id) {
                                const otherMembers = Object.entries(channel.data.members).filter(([id]) => id !== user.id).map(([_, memberData]) => memberData.user);
                                if (otherMembers.length > 0 && otherMembers[0]?.name) return otherMembers[0].name;
                            }
                            return 'Chat';
                        })()}
                    </Text>
                    <TouchableOpacity onPress={() => setShowSidebar(true)}>
                        <Ionicons name="calendar" size={24} color="#503E74" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            <View className="flex-1 bg-gray-100">
                <Channel channel={channel}>
                    <View className="flex-1">
                        <MessageList />
                        <MessageInput />
                    </View>
                </Channel>
                <Sidebar visible={showSidebar} onClose={() => setShowSidebar(false)} events={events} tasks={tasks} />
            </View>
        </>
    );
}

export default Chat;
