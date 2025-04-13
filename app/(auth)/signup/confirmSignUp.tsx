import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import React from "react";

export default function confirmSignUp(){
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

                    <View className="flex-1 justify-center items-center bg-white px-6">
                        <Text className="text-xl font-bold text-black mb-1">Enter confirmation code</Text>
                        <Text className="text-gray-500 mb-6">A 4-digit code was sent to your email</Text>

                        <View className="flex-row space-x-4 mb-6">
                            {Array(4).fill(0).map((_, i) => (
                                <TextInput
                                    key={i}
                                    className="w-14 h-14 text-xl text-center border-2 border-violet-500 rounded-md text-black"
                                    placeholder="•"
                                    placeholderTextColor="#999"
                                    keyboardType="numeric"
                                />
                            ))}
                        </View>

                        <Text className="text-gray-500 text-sm">
                            Didn't receive a code?{' '}
                            <Text className="text-blue-500 font-semibold">Resend</Text>
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-englishViolet rounded-full py-4 mt-44"
                >
                    <Text className="text-white text-center font-semibold">Confirm Email</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}