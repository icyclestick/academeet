import { useAuth } from '@/providers/AuthProviders';
import { useMatchedProfiles } from '@/hooks/useMatchedProfiles';
import {View, Text, Image, TouchableOpacity, Alert} from "react-native";
import {supabase} from "@/lib/supabase";
import { router } from 'expo-router';
import { useProfileStore } from '@/stores/profileStore';
import { useEffect } from 'react';
import { useChatContext } from 'stream-chat-expo';

const MatchedScreen = () => {
    const { profile, session } = useAuth();
    const { matchedProfiles, loading, error } = useMatchedProfiles(profile?.id);
    const setMatchedBuddy = useProfileStore((state) => state.setMatchedBuddy);
    const resetBuddy = useProfileStore((state) => state.resetBuddy);
    const { client } = useChatContext();

    // Set buddy state when matchedProfiles is loaded
    useEffect(() => {
        if (matchedProfiles && matchedProfiles.length > 0) {
            setMatchedBuddy(matchedProfiles[0]);
        }
    }, [matchedProfiles, setMatchedBuddy]);

    // Helper to get buddyId (the other user in the match)
    const buddyId = matchedProfiles.length > 0 ? matchedProfiles[0].id : null;

    const handleUnmatch = () => {
        Alert.alert(
            "Unmatch Buddy",
            "Are you sure you want to unmatch?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Unmatch", style: "destructive", onPress: async () => {
                    if (session?.user?.id && buddyId) {
                        // Soft unmatch: set is_active to false for both directions
                        await supabase
                            .from('matches')
                            .update({ is_active: false })
                            .or(`and(user1_id.eq.${session.user.id},user2_id.eq.${buddyId}),and(user1_id.eq.${buddyId},user2_id.eq.${session.user.id})`);
                    }
                    // Hide Stream channel for current user
                    if (client && buddyId && session?.user?.id) {
                        const members = [session.user.id, buddyId].sort();
                        const channel = client.channel('messaging', {
                            members,
                        });
                        try {
                            await channel.hide();
                        } catch (e) {
                            console.warn('Failed to hide Stream channel:', e);
                        }
                    }
                    resetBuddy();
                    router.replace('/(buddy)/quiz/form');
                }}
            ]
        );
    };

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

    console.log(matchedProfiles)
    return (
        <View className="flex-1 p-4 w-full items-center justify-center bg-white">
            <Text className="text-2xl font-bold mb-4 text-englishViolet w-2/3">
                📖 It’s a match! Studying just got a little more exciting.
            </Text>
            {matchedProfiles.map(profile => {
                    if (!profile.avatar_url) return null;
                    const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url);
                    const avatarUrl = data.publicUrl;
                    return (
                        <View key={profile.id} className="flex flex-col items-center px-0 py-8 bg-oldLace rounded-lg w-2/3 mb-4 border border-blueStroke">
                            <Image source={{ uri: avatarUrl }} className="w-48 h-48 rounded-lg" resizeMode="cover" />
                            <Text className="text-xl font-bold">{profile.full_name}</Text>
                            <Text className="text-sm font-bold text-gray-500 mb-4">@{profile.username}</Text>
                            {/* Separator */}
                            <View className="self-stretch h-px bg-gray-300 my-4" />
                            {/* Preferences */}
                            <View className=" flex justify-center items-center w-full items-start">
                              {profile.preferences && Object.entries(profile.preferences).map(([key, value]) => (
                                <Text key={key} className="text-sm text-gray-700 mb-1">{key}: {value}</Text>
                              ))}
                            </View>
                        </View>
                    );
                })}
            <TouchableOpacity
                className="bg-red-500 rounded-full py-3 px-8 mt-4"
                onPress={handleUnmatch}
            >
                <Text className="text-white text-center font-semibold text-lg">Unmatch Buddy</Text>
            </TouchableOpacity>
            <TouchableOpacity
                className="bg-englishViolet rounded-full py-3 px-8 mt-8"
                onPress={() => router.push('/(home)/(tabs)')}
            >
                <Text className="text-white text-center font-semibold text-lg">Go to Dashboard</Text>
            </TouchableOpacity>
        </View>
    );
};

export default MatchedScreen;