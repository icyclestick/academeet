import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/types/Supabase';

export function useMatchedProfiles(currentUserId: string) {
  const [matchedProfiles, setMatchedProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      setError(null);
      try {
        // Find all active matches where the user is either user1_id or user2_id
        const { data: matches, error: matchError } = await supabase
          .from('matches')
          .select('user1_id, user2_id')
          .or(`user1_id.eq.${currentUserId},user2_id.eq.${currentUserId}`)
          .eq('is_active', true);

        if (matchError) throw matchError;
        const buddyIds = (matches || []).map((m: any) =>
          m.user1_id === currentUserId ? m.user2_id : m.user1_id
        ).filter(Boolean); // filter out nulls

        if (buddyIds.length === 0) {
          setMatchedProfiles([]);
          setLoading(false);
          return;
        }

        // Fetch buddy profiles
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', buddyIds);

        if (profileError) throw profileError;

        setMatchedProfiles(profiles || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    }
    if (currentUserId) fetchMatches();
  }, [currentUserId]);

  return { matchedProfiles, loading, error };
}

// Usage:
// const { matchedProfiles, loading, error } = useMatchedProfiles(currentUserId);
// matchedProfiles is an array of user profiles you are matched with.