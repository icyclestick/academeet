import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "@/providers/AuthProviders";
import {
  useChatContext,
  Channel,
  MessageInput,
  MessageList,
} from "stream-chat-expo";
import type { Channel as StreamChannel } from "stream-chat";
import { Ionicons } from "@expo/vector-icons";
import Sidebar from "@/components/Sidebar";
import { supabase } from "@/lib/supabase";

import { useStreamVideoClient } from "@stream-io/video-react-native-sdk";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";

const ChatHeader = ({
  onCalendarPress,
  onVideoCallPress,
}: {
  onCalendarPress: () => void;
  onVideoCallPress: () => void;
}) => {
  return (
    <View className="flex-row justify-between items-center p-4 bg-white border-b border-gray-200">
      <Text className="text-lg font-semibold text-gray-800">Chataa</Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={onVideoCallPress}>
          <Ionicons name="call" size={24} color="#503E74" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCalendarPress}>
          <Ionicons name="calendar" size={24} color="#503E74" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Chat = () => {
  const { user } = useAuth();
  const { client } = useChatContext();
  const videoClient = useStreamVideoClient();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<StreamChannel | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const setupChannel = async () => {
      if (!user?.id) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const { data: match, error } = await supabase
          .from("matches")
          .select("user1_id, user2_id")
          .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
          .eq("is_active", true)
          .single();

        let buddyId: string | null = null;
        if (match) {
          buddyId =
            match.user1_id === user.id ? match.user2_id : match.user1_id;
        }

        if (buddyId) {
          const channels = await client.queryChannels(
            {
              type: "messaging",
              members: { $eq: [user.id, buddyId] },
            },
            { last_message_at: -1 },
            { limit: 1 }
          );

          if (channels.length > 0) {
            setChannel(channels[0]);
            return;
          } else {
            setError("No conversation available");
          }
        } else {
          setError("No buddy found");
        }
      } catch (err) {
        console.error("Channel setup error:", err);
        setError("Could not load chat");
      } finally {
        setLoading(false);
      }
    };
    setupChannel();
  }, [user?.id]);

  const handleVideoCallPress = async () => {
    if (!channel) {
      console.warn("No active channel to start video call");
      return;
    }

    try {
      const members = Object.values(channel.state.members).map((member) => ({
        user_id: member.user_id,
      }));

      // Create a new call instance with unique ID
      const call = videoClient.call("default", Crypto.randomUUID());

      // Create or get the call
      await call.getOrCreate({
        ring: true,
        data: { members },
      });

      // Navigate to your video call screen, pass the call id
      router.push({
        pathname: "/(call)/callScreen",
        params: { callId: call.id },
      });
    } catch (error) {
      console.error("Error starting video call:", error);
    }
  };

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
      <SafeAreaView style={{ backgroundColor: "white" }}>
        <ChatHeader
          onCalendarPress={() => setShowSidebar(true)}
          onVideoCallPress={handleVideoCallPress}
        />
      </SafeAreaView>
      <View className="flex-1 bg-gray-100 pb-28">
        <Channel channel={channel}>
          <View className="flex-1">
            <MessageList />
            <MessageInput />
          </View>
        </Channel>
        <Sidebar
          visible={showSidebar}
          onClose={() => setShowSidebar(false)}
          userId={user?.id}
        />
      </View>
    </>
  );
};

export default Chat;
