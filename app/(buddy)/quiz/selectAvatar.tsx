import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import Avatar from "@/components/Avatar";
import { useProfileStore } from "@/stores/profileStore";
import { useAuth } from "@/providers/AuthProviders";
import {Entypo} from "@expo/vector-icons";
import {router} from "expo-router";
import {updateProfileData} from "@/lib/api/profile";

const SelectAvatar = () => {
    const { session } = useAuth();
    const { avatarUrl, setAvatarUrl } = useProfileStore();
    const [loading, setLoading] = useState(false);

    const handleAvatarUpload = async (url: string) => {
        try {
            console.log("Starting avatar upload...");
            setLoading(true);
            setAvatarUrl(url);

            // Only passing avatar_url to update the avatar field
            await updateProfileData({
                userId: session.user.id,
                avatar_url: url,
                // Pass undefined for the fields you don't want to update
                username: undefined,
                website: undefined,
                full_name: undefined,
            });

            Alert.alert("Success","Avatar uploaded!");
        } catch (err) {
            console.error("Upload failed:", err);
            Alert.alert("Upload failed", err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-white px-6 py-12 justify-between">
            <View>
                {/* Back Button */}
                <TouchableOpacity
                    className="mb-12"
                    onPress={() => router.back()}
                >
                    <Entypo name="chevron-left" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-black text-2xl font-bold">Sign Up</Text>
                <Text className="text-gray-500 text-base">Create an account to get started</Text>

                <Avatar
                    size={200}
                    url={avatarUrl}
                    onUpload={(url: string) => handleAvatarUpload(url)}
                />
            </View>

            <View className="w-full items-center py-10">
                <TouchableOpacity
                    disabled={loading}
                    onPress={async () => {
                        await handleAvatarUpload(avatarUrl);
                    }}
                    className="bg-englishViolet rounded-full px-24 py-4"
                >
                    <Text className="text-white text-center font-semibold">
                        {loading ? "Updating..." : "Continue"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SelectAvatar;
