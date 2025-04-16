import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants/images";
import {router} from "expo-router";

const index = () => {
    return (
        <SafeAreaView className="flex-1 bg-isabelline">
            {/* Main content container */}
            <View className="flex-1 justify-center items-center px-4">
                <Image
                    source={images.logoNoBg}
                    className="w-48 h-48 rounded-lg"
                    resizeMode="cover"
                />
                <View className="px-4 pb-8 mt-10">
                    <TouchableOpacity
                        className="bg-englishViolet rounded-lg py-4 px-8"
                        onPress={() => router.push("/(buddy)/quiz/selectAvatar")}
                    >
                        <Text
                            className="text-white text-center text-lg font-semibold"
                        >
                            Find a Study Buddy
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text
                    className="text-blue-500 text-center underline"
                    onPress={() => router.push("/")}
                >
                    Already have a study buddy?
                </Text>
            </View>
        </SafeAreaView>
    )
}

export default index