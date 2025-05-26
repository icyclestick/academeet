import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';

const WaitingRoom = () => {
  const { profile } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      // Watch for matches where the user is either user_id or buddy_id
      const { data: matches, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user_id.eq.${profile.id},buddy_id.eq.${profile.id}`)
        .limit(1)
        .single();

      if (matches) {
        clearInterval(interval);
        router.replace('/(buddy)/matchedScreen');
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [profile.id]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#503e74" />
      <Text className="mt-6 text-xl font-bold text-englishViolet">Looking for your study buddy…</Text>
    </View>
  );
};

export default WaitingRoom;
