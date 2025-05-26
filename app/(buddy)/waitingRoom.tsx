import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';

const WaitingRoom = () => {
  const { profile } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      // Watch for active matches where the user is either user1_id or user2_id
      const { data: match, error } = await supabase
        .from('matches')
        .select('id')
        .or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (match) {
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
