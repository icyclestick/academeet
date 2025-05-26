import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/providers/AuthProviders';

const WaitingRoom = () => {
  const { profile } = useAuth();

  useEffect(() => {
    const interval = setInterval(async () => {
      // Replace with your actual logic to check for a match
      const { data } = await supabase
        .from('matches')
        .select('*')
        .eq('user_id', profile.id)
        .single();

      if (data) {
        clearInterval(interval);
        router.replace('/(buddy)/matchedScreen');
      }
    }, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#503e74" />
      <Text className="mt-6 text-xl font-bold text-englishViolet">Looking for your study buddy…</Text>
    </View>
  );
};

export default WaitingRoom;
