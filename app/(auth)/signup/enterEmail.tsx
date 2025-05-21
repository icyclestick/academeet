import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {useAuthStore} from "@/stores/authStore";

export default function enterEmail(){
    const email = useAuthStore((state) => state.email);
    const setEmail = useAuthStore((state) => state.setEmail);

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

                    {/* Email Input */}
                    <View className="mt-6">
                        <Text className="text-gray-700 font-semibold mb-1">Email</Text>
                        <TextInput
                            className="border border-gray-300 rounded-lg px-4 py-3"
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            placeholder="email@address.com"
                            placeholderTextColor="gray"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View className="px-2 mt-2 mb-2">
                        <Text className="text-sm text-gray-500">Make sure to enter a valid .edu or school-affiliated email address.</Text>
                    </View>

                    <View className="relative flex-row items-center py-5">
                        <View className="flex-1 border-t border-gray-400" />
                        <Text className="mx-4 text-gray-400">or</Text>
                        <View className="flex-1 border-t border-gray-400" />
                    </View>

                    {/* Google Button */}
                    <TouchableOpacity className="bg-englishViolet flex-row items-center justify-center py-3 rounded-lg mb-3">
                        <FontAwesome name="google" size={20} color="white" className="mr-2" />
                        <Text className="text-white font-semibold ml-2">
                            Continue with Google
                        </Text>
                    </TouchableOpacity>

                    {/* Microsoft Button */}
                    <TouchableOpacity className="bg-englishViolet flex-row items-center justify-center py-3 rounded-lg mb-6">
                        <FontAwesome name="windows" size={20} color="white" className="mr-2" />
                        <Text className="text-white font-semibold ml-2">
                            Continue with Microsoft
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
                className="bg-englishViolet rounded-full py-4 mt-44"
                onPress={() => router.push("/(auth)/signup/confirmSignUp")}
            >
                <Text className="text-white text-center font-semibold">Verify Email</Text>
            </TouchableOpacity>
        </View>
    )
}