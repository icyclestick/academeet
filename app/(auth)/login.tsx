import React, { useState } from 'react';
import {Alert, View, Text, TextInput, TouchableOpacity, Linking} from 'react-native';
import { supabase } from '@/lib/supabase';
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {router} from "expo-router";

export default function AuthSignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signInWithEmail() {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        setLoading(false);
    }

    return (
        <View className="flex-1 bg-white px-6 py-12">
            <View className="flex-1 justify-between">

                {/* Top Content */}
                <View>
                    {/* Back Button */}
                    <TouchableOpacity
                        className="mb-12"
                        onPress={() => router.back()}
                    >
                        <Entypo name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>

                    <Text className="text-black text-2xl font-bold">Log in</Text>
                    <Text className="text-gray-500 text-base">Log in to your account to continue studying</Text>

                    {/* Email Input */}
                    <View className="mt-6">
                        <Text className="text-gray-700 font-semibold mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={setEmail}
                            value={email}
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
                            onChangeText={setPassword}
                            value={password}
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                        />
                    </View>

                    <View className="px-2 mt-8 mb-2">
                        <Text
                            className="text-blue-500 text-sm font-semibold mb-1"
                            onPress={() => Linking.openURL("")}
                        >
                            Forgot Password?
                        </Text>
                        <Text className="text-sm font-semibold mb-1">
                            Don't have an account?{" "}
                            <Text
                                className="text-blue-500"
                                onPress={() => router.push('/signup/enterEmail')}
                            >
                                Sign Up
                            </Text>
                        </Text>
                    </View>

                    <View className="relative flex-row items-center py-5">
                        <View className="flex-1 border-t border-gray-400" />
                        <Text className="mx-4 text-gray-400">or</Text>
                        <View className="flex-1 border-t border-gray-400" />
                    </View>

                    {/* Google Button */}
                    <TouchableOpacity className="bg-englishViolet flex-row items-center justify-center py-3 rounded-lg mb-3">
                        <FontAwesome name="google" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Microsoft Button */}
                    <TouchableOpacity className="bg-englishViolet flex-row items-center justify-center py-3 rounded-lg mb-6">
                        <FontAwesome name="windows" size={20} color="white" />
                        <Text className="text-white font-semibold ml-2">
                            Continue with Microsoft
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                    className="bg-englishViolet rounded-full py-4"
                    disabled={loading}
                    onPress={signInWithEmail}
                >
                    <Text className="text-white text-center font-semibold">Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}
