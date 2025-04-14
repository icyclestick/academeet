import React, { useState } from 'react';
import {Alert, View, Text, TextInput, TouchableOpacity, Linking} from 'react-native';
import { supabase } from '@/lib/supabase';
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {router} from "expo-router";
import {CheckBox} from "react-native-elements";
import { useAuthStore } from "@/stores/authStore";

export default function indexSignUp() {
    // Use the Zustand store
    const { email, setEmail, password, setPassword, name, setName, resetAuth } = useAuthStore();
    const [isChecked, setIsChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');

    async function signUpWithEmail() {
        setLoading(true);
        if (password !== confirmPassword) {
            Alert.alert("Passwords do not match");
            setLoading(false);
            return;
        }
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for email verification!');
        resetAuth()
        setLoading(false);
    }

    return (
        <View className="flex-1 bg-white px-6 py-12">
            <View className="w-full flex-1 justify-between">
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

                    {/* Name Input */}
                    <View className="mt-6">
                        <Text className="text-gray-700 font-semibold mb-1">Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={(text) => setName(text)} // Use setName from your store
                            value={name} // Use name from your store
                            placeholder="Your Name"
                            placeholderTextColor="gray"
                            autoCapitalize="words" // Corrected autoCapitalize

                        />
                    </View>

                    {/* userName Input */}
                    <View className="mt-6">
                        <Text className="text-gray-700 font-semibold mb-1">User Name</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={(text) => setEmail(text)} //changed to setEmail
                            value={email} //changed to email
                            placeholder="email@address.com"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    {/* Password Input */}
                    <View className="mt-4">
                        <Text className="text-gray-700 font-semibold mb-1">Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={(text) => setPassword(text)} // Use setPassword
                            value={password}  // Use password
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Confirm Password Input */}
                    <View className="mt-4">
                        <Text className="text-gray-700 font-semibold mb-1">Confirm Password</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={(text) => setConfirmPassword(text)}
                            value={confirmPassword}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="items-center mt-8">
                        <View className="flex flex-row items-start">
                            <CheckBox
                                checked={isChecked}
                                onPress={() => setIsChecked(!isChecked)}
                                checkedColor="#3b82f6"
                                uncheckedColor="#d1d5db"
                                containerStyle={{ margin: 0, padding: 0 }}
                                wrapperStyle={{ flexDirection: 'row-reverse' }}
                            />
                            <Text className="text-sm text-gray-700 leading-tight">
                                I've read and agree with the{' '}
                                <Text className="text-blue-500 underline">Terms and Conditions</Text>
                                {' '}and the{' '}
                                <Text className="text-blue-500 underline">Privacy Policy</Text>
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
                className="bg-gray-300 rounded-full py-4 mt-44"
                disabled={loading}
                onPress={signUpWithEmail}
            >
                <Text className="text-black text-center font-semibold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}
