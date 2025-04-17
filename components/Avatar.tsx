import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {StyleSheet, View, Text, Alert, Image, Button, TouchableOpacity, ActivityIndicator} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import {Feather} from "@expo/vector-icons";

interface Props {
    size: number
    url: string | null
    onUpload: (filePath: string) => void
}

export default function Avatar({ url, size = 150, onUpload }: Props) {
    const [uploading, setUploading] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const avatarSize = { height: size, width: size }

    useEffect(() => {
        if (url) downloadImage(url)
    }, [url])

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from('avatars').download(path)

            if (error) {
                throw error
            }

            const fr = new FileReader()
            fr.readAsDataURL(data)
            fr.onload = () => {
                setAvatarUrl(fr.result as string)
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error downloading image: ', error.message)
            }
        }
    }

    async function uploadAvatar() {
        try {
            setUploading(true)

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images, // Restrict to only images
                allowsMultipleSelection: false, // Can only select one image
                allowsEditing: true, // Allows the user to crop / rotate their photo before uploading it
                quality: 1,
                exif: false, // We don't want nor need that data.
            })

            if (result.canceled || !result.assets || result.assets.length === 0) {
                console.log('User cancelled image picker.')
                return
            }

            const image = result.assets[0]
            console.log('Got image', image)

            if (!image.uri) {
                throw new Error('No image uri!') // Realistically, this should never happen, but just in case...
            }

            const arraybuffer = await fetch(image.uri).then((res) => res.arrayBuffer())

            const fileExt = image.uri?.split('.').pop()?.toLowerCase() ?? 'jpeg'
            const path = `${Date.now()}.${fileExt}`
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, arraybuffer, {
                    contentType: image.mimeType ?? 'image/jpeg',
                })

            if (uploadError) {
                throw uploadError
            }

            onUpload(data.path)
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message)
            } else {
                throw error
            }
        } finally {
            setUploading(false)
        }
    }

    return (
        <TouchableOpacity
            onPress={uploadAvatar}
            disabled={uploading}
            className="items-center justify-center w-24 h-24 rounded-lg bg-gray-200 overflow-hidden border border-gray-300"
        >
            {uploading ? (
                <ActivityIndicator size="small" color="#9ca3af" />
            ) : avatarUrl ? (
                <Image
                    source={{ uri: avatarUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
            ) : (
                <Feather name="plus" size={32} color="#9ca3af" />
            )}
        </TouchableOpacity>
    )
}