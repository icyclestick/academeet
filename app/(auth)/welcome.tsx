import {Image, SafeAreaView, Text, TouchableOpacity, View} from "react-native";

const Welcome = () => {
    return (
        <>
            <SafeAreaView className="flex-1 justify-center items-center bg-isabelline gap-4">
                <Image
                    source={{ uri: "https://via.placeholder.com/80" }} // Placeholder Image
                    className="w-36 h-36 bg-gray-300 rounded-lg"
                    resizeMode="cover"
                />
                <Text>Smarter Studying Starts Here!</Text>
                <TouchableOpacity>
                    <Text>Get Started</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    );
};

export default Welcome;
