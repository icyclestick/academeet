import { useEffect, useState } from 'react';
import { useChatContext } from 'stream-chat-expo'; // adjust if you use a different Stream Chat hook
import { supabase } from '@/lib/supabase'; // adjust the import to your supabase client location

// Type for user profile, adjust fields as needed
type UserProfile = {
  full_name?: string;
  id: string;
  username?: string;
  avatar_url?: string;
  // ...add more fields as your profiles table defines
};

export function useMatchedProfiles(currentUserId: string) {
  const { client } = useChatContext(); // get stream chat client
  const [matchedProfiles, setMatchedProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      setError(null);
      try {
        // 1. Query channels where current user is a member
        const channels = await client.queryChannels({
          members: { $in: [currentUserId] },
        });
        // 2. Extract other member IDs
        const otherUserIds = Array.from(new Set(
          channels.flatMap((ch: any) =>
            ch.state.members
              ? Object.keys(ch.state.members).filter((id) => id !== currentUserId)
              : []
          )
        ));
        if (otherUserIds.length === 0) {
          setMatchedProfiles([]);
          setLoading(false);
          return;
        }
        // 3. Fetch profiles from Supabase
        const { data, error: supaError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', otherUserIds);
        if (supaError) throw supaError;
        setMatchedProfiles(data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch matches');
      } finally {
        setLoading(false);
      }
    }
    if (currentUserId && client) fetchMatches();
  }, [currentUserId, client]);

  return { matchedProfiles, loading, error };
}

// Usage:
// const { matchedProfiles, loading, error } = useMatchedProfiles(currentUserId);
// matchedProfiles is an array of user profiles you are matched with.