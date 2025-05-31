import React, { PropsWithChildren, useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-native-sdk';
import { useAuth } from '@/providers/AuthProviders';
import { tokenProvider } from '@/utils/tokenProvider';  // <-- import here

const apiKey = process.env.EXPO_PUBLIC_STREAM_API_KEY;

export default function VideoProvider({ children }: PropsWithChildren) {
  const { profile } = useAuth();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!profile) return;

    const initVideoClient = async () => {
      const user = {
        id: profile.id,
        name: profile.full_name,
        image: profile.avatar_url ? `https://your-supabase-url/storage/v1/object/public/avatars/${profile.avatar_url}` : undefined,
      };

      const client = new StreamVideoClient({
        apiKey,
        user,
        tokenProvider, // <-- use your imported async tokenProvider here
      });

      setVideoClient(client);
    };

    initVideoClient();

    return () => {
      if (videoClient) {
        videoClient.disconnectUser();
      }
    };
  }, [profile?.id]);

  if (!videoClient) {
    return null; // Or a loader
  }

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}
