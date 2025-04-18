import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Alert, View, Text, TouchableOpacity } from 'react-native';
import Avatar from "@/components/Avatar";
import { useProfileStore } from "@/stores/profileStore";
import { useAuth } from "@/providers/AuthProviders";
import {Entypo} from "@expo/vector-icons";
import {router} from "expo-router";
import {updateProfileData} from "@/lib/api/profile";
import PredefinedAvatarPicker from "@/components/PredefinedAvatarPicker";
import BackButton from "@/components/BackButton";

const predefinedAvatars = [
    {
        id: 'alien',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//alienAvatar.png',
        bgColor: '#AEE6DD',
    },
    {
        id: 'bernese',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//berneseAvatar.png',
        bgColor: '#FFCC81',
    },
    {
        id: 'dino',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//dinoAvatar.png',
        bgColor: '#E791FE',
    },
    {
        id: 'ghost',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//ghostAvatar.png',
        bgColor: '#FFDB01',
    },
    {
        id: 'koala',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//koalaFlamingoAvatar.png',
        bgColor: '#DB9AFE',
    },
    {
       id: 'mon',
       url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//monsterAvatar.png',
       bgColor: '#DAE83D',
    },
    {
        id: 'octo',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//octopusAvatar.png',
        bgColor: '#42BCFD',
    },
    {
        id: 'penguin',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//penguinAvatar.png',
        bgColor: '#9D91FF',
    },
    {
        id: 'turtle',
        url: 'https://upqmmkojbkshfrmtvwpf.supabase.co/storage/v1/object/public/predefined-avatars//turtleAvatar.png',
        bgColor: '#25CBFF',
    }
]

const SelectAvatar = () => {
    const { session } = useAuth();
    const { avatarUrl, setAvatarUrl } = useProfileStore();
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
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
                <BackButton />

                <Text className="text-black text-2xl font-bold">Sign Up</Text>
                <Text className="text-gray-500 text-base">Create an account to get started</Text>

                <View className="flex-row flex-wrap">
                    <PredefinedAvatarPicker
                        avatars={predefinedAvatars}
                        selectedAvatar={selectedAvatar}
                        onSelect={setSelectedAvatar}
                    />
                </View>
                <View className="my-4">
                    <Avatar
                        size={85}
                        url={avatarUrl}
                        onUpload={(url: string) => handleAvatarUpload(url)}
                    />
                </View>

            </View>

            <View className="w-full items-center py-10">
                <TouchableOpacity
                    disabled={loading}
                    onPress={async () => {
                        await handleAvatarUpload(avatarUrl);
                        router.push('/(buddy)/quiz/form');
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
