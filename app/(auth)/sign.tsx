import {Image, Linking, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants/images";
import React from "react";
import {router} from "expo-router";

const Sign = () => {
    return (
        <>
            <SafeAreaView className="flex-1 bg-isabelline">
                {/* Main content container */}
                <View className="flex-1 justify-center items-center px-4">
                    <Image
                        source={images.logoNoBg}
                        className="w-36 h-36 rounded-lg"
                        resizeMode="cover"
                    />
                    <Text className="font-dortmund text-2xl font-bold text-center text-englishViolet mt-10">
                        Smarter Studying
                    </Text>
                    <Text className="font-dortmund text-2xl font-bold text-center text-englishViolet">
                        Starts Here!
                    </Text>
                    <View className="w-full mt-10 px-4 pb-8">
                        {/* Sign In Button */}
                        <TouchableOpacity
                            className="bg-englishViolet rounded-full py-4 px-8"
                            onPress={() => {
                                router.push("/login");
                            }}
                        >
                            <Text className="text-white text-center font-semibold">Sign In</Text>
                        </TouchableOpacity>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            className="bg-gray-300 rounded-full py-4 px-8 mt-4"
                            onPress={() => router.push("/signup/indexSignUp")}
                        >
                            <Text className="text-black text-center font-semibold">Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View className="px-4 mt-8 pb-8">
                    <Text className="text-center text-sm">
                        By continuing, you accept our{" "}
                    </Text>
                    <Text className="text-center text-sm text-black">
                        <Text
                            className="text-blue-500 underline"
                            onPress={() => Linking.openURL("")}
                        >
                            Terms of Service
                        </Text>{" "}
                        <Text className="text-black">and</Text>{" "}
                        <Text
                            className="text-blue-500 underline"
                            onPress={() => Linking.openURL("")}
                        >
                            Privacy Policy
                        </Text>
                    </Text>
                </View>

            </SafeAreaView>
        </>
    );
};

export default Sign;
