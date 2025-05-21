import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";
import {images} from "@/constants/images";

const Welcome = () => {
    return (
        <>
            <SafeAreaView className="flex-1 bg-isabelline">
                {/* Main content container */}
                <View className="flex-1 justify-center items-center px-4">
                    <Image
                        source={images.logoNoBg}
                        className="w-48 h-48 rounded-lg"
                        resizeMode="cover"
                    />
                    <Text className="font-dortmund text-3xl text-center text-englishViolet mt-10">
                        Smarter Studying Starts Here!
                    </Text>
                </View>

                {/* Button container */}
                <View className="px-4 pb-8">
                    <TouchableOpacity className="bg-englishViolet rounded-full py-4 px-8">
                        <Text className="text-white text-center text-lg font-semibold">Get Started</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
};

export default Welcome;
