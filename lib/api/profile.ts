import { supabase } from '../supabase';

export const updateProfileData = async ({
                                            userId,
                                            avatar_url,
                                            username,
                                            website,
                                            full_name,
                                        }: {
    userId: string;
    avatar_url: string;
    username?: string;
    website?: string;
    full_name?: string;
}) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .upsert(
                {
                    id: userId, // Make sure you are passing 'id' not 'user_id'
                    avatar_url,
                    username,
                    website,
                    full_name,
                    updated_at: new Date(),
                },
                { onConflict: 'id' }  // onConflict should use the primary key column ('id')
            );

        if (error) throw error;
        return data;
    } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
    }
};
