import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from "@/stores/authStore";
import { useAuth } from "@/providers/AuthProviders";
import { router } from "expo-router";
import { updateProfileData } from "@/lib/api/profile";

const UpdateProfilePage = () => {
    const { session } = useAuth();
    const { name, username, setName, setUsername } = useAuthStore();

    const [newFullName, setNewFullName] = useState(name);
    const [newUsername, setNewUsername] = useState(username);
    const [loading, setLoading] = useState(false);

    const updateProfile = async () => {
        if (!newFullName || !newUsername) {
            Alert.alert("Error", "Full Name and Username are required");
            return;
        }

        try {
            setLoading(true);
            await updateProfileData({
                userId: session.user.id,
                avatar_url: undefined,
                username: newUsername,
                website: undefined,
                full_name: newFullName,
            });

            // Update store with new values
            setName(newFullName);
            setUsername(newUsername);

            Alert.alert("Profile Updated!", "Your profile information has been updated successfully.");
            router.push('/(buddy)/quiz/form');
        } catch (err) {
            console.error("Profile update failed:", err);
            Alert.alert("Error", "Something went wrong while updating your profile.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setNewFullName(name);
        setNewUsername(username);
    }, [name, username]);

    return (
        <View className="flex-1 bg-white px-6 py-12">
            <View>
                <Text className="text-black text-2xl font-bold">Update Profile</Text>
                <Text className="text-gray-500 text-base mb-6">Update your full name and username.</Text>

                <View className="mt-4">
                    <Text className="text-gray-700 font-semibold mb-1">Full Name</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        value={newFullName}
                        onChangeText={setNewFullName}
                        placeholder="Full Name"
                        autoCapitalize="words"
                    />
                </View>

                <View className="mt-4">
                    <Text className="text-gray-700 font-semibold mb-1">Username</Text>
                    <TextInput
                        className="border border-gray-300 rounded-lg px-4 py-3"
                        value={newUsername}
                        onChangeText={setNewUsername}
                        placeholder="Username"
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    className="bg-englishViolet rounded-full py-4 mt-8"
                    onPress={updateProfile}
                    disabled={loading}
                >
                    <Text className="text-white text-center font-semibold">
                        {loading ? 'Updating...' : 'Update Profile'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default UpdateProfilePage;
