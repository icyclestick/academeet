import React, { useState } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Auth() {
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

    async function signUpWithEmail() {
        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) Alert.alert(error.message);
        if (!session) Alert.alert('Please check your inbox for email verification!');
        setLoading(false);
    }

    return (
        <View className="flex-1 bg-white px-6 py-12">
            {/* Back Button */}
            <TouchableOpacity className="mb-12">
                <Text className="text-3xl font-bold">{'<'}</Text>
            </TouchableOpacity>

            <Text className="text-black text-2xl font-bold">Log in</Text>
            <Text className="text-gray-500 text-base">Log in to your account to continue studying</Text>

            {/* Email Input */}
            <View className="mt-6">
                <Text className="text-gray-700 font-semibold mb-1">Email</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    placeholder="email@address.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
            </View>

            {/* Password Input */}
            <View className="mt-4">
                <Text className="text-gray-700 font-semibold mb-1">Password</Text>
                <TextInput
                    className="border border-gray-300 rounded-lg px-4 py-3"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    secureTextEntry
                    placeholder="Password"
                    autoCapitalize="none"
                />
            </View>

            <View className="mt-4 mb-64">
                <View>
                    <TouchableOpacity onPress={() => {/* Handle forgot password */}}>
                        <Text className="text-blue-500 text-xs font-semibold mb-1">Forgot Password?</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-xs font-semibold"> {/* flex-row for horizontal layout */}
                    <View>
                        <Text className="text-sm font-semibold">
                            Don't have an account?
                            <Text className="text-blue-500"> Sign up</Text>
                        </Text>
                    </View>
                </Text>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
                className="bg-blue-500 rounded-full py-4 mt-6"
                disabled={loading}
                onPress={signInWithEmail}
            >
                <Text className="text-white text-center font-semibold">Sign In</Text>
            </TouchableOpacity>

            {/* Sign Up Button */}
            <TouchableOpacity
                className="bg-gray-300 rounded-full py-4 mt-4"
                disabled={loading}
                onPress={signUpWithEmail}
            >
                <Text className="text-black text-center font-semibold">Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
}
