import { useAuth } from '@/providers/AuthProviders';
import { useMatchedProfiles } from '@/hooks/useMatchedProfiles';
import {View, Text, Image} from "react-native";
import {supabase} from "@/lib/supabase";

const MatchedScreen = () => {
    const { profile } = useAuth();
    const { matchedProfiles, loading, error } = useMatchedProfiles(profile?.id);

    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error}</Text>;

        console.log(matchedProfiles)
    return (
        <View className="flex-1 p-4 w-full items-center justify-center bg-red-800">
            <Text className="text-2xl font-bold mb-4 text-englishViolet">
                📖 It’s a match! Studying just got a little more exciting.
            </Text>
            {matchedProfiles.map(profile => {
                    if (!profile.avatar_url) return null;
                    const { data } = supabase.storage.from('avatars').getPublicUrl(profile.avatar_url);
                    const avatarUrl = data.publicUrl;
                    return (
                        <View key={profile.id} className="flex items-center px-12 py-8 bg-oldLace rounded-lg w-full">
                            <Image source={{ uri: avatarUrl }} className="w-48 h-48 rounded-lg" resizeMode="cover" />
                            <Text>{profile.full_name}</Text>
                            <Text>@{profile.username}</Text>
                        </View>
                    );
                })}
        </View>
    );
};

export default MatchedScreen;