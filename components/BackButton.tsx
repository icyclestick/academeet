import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

const BackButton = () => {
    return (
        <TouchableOpacity
            className="mb-12"
            onPress={() => router.back()}
        >
            <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
    );
};

export default BackButton;
