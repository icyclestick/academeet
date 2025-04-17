import { View, TouchableOpacity, Image } from "react-native";
import clsx from "clsx";

const PredefinedAvatarPicker = ({
                                    avatars,
                                    selectedAvatar,
                                    onSelect,
                                }: {
    avatars: { id: string; url: string; bgColor: string }[];
    selectedAvatar: string | null;
    onSelect: (url: string) => void;
}) => {
    return (
        <View className="flex-row flex-wrap gap-4 mt-6 justify-between">
            {avatars.map(({ id, url, bgColor }) => (
                <TouchableOpacity
                    key={id}
                    onPress={() => onSelect(url)}
                    className={clsx(
                        "w-24 h-24 rounded-lg p-4  justify-center items-center",
                        selectedAvatar === url ? "border-2 border-englishViolet" : "",
                    )}
                    style={{ backgroundColor: bgColor }}
                >
                    <Image source={{ uri: url }} style={{ width: 64, height: 64 }} resizeMode="contain" />
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default PredefinedAvatarPicker;
