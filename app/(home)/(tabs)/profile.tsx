import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { StyleSheet, View, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { useAuth } from '@/providers/AuthProviders';
import Avatar from '@/components/Avatar';
import { useProfileStore } from '@/stores/profileStore';

export default function Profile() {
    const { session } = useAuth();
    const {
        username,
        profilePic,
        bio,
        university,
        yearLevel,
        studyPreferences,
        setProfile,
    } = useProfileStore();
    const [website, setWebsite] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) getProfile();
    }, [session]);

    async function getProfile() {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { data, error, status } = await supabase
                .from('profiles')
                .select(`username, name, profilePic, bio, university, yearLevel, studyPreferences`)
                .eq('id', session.user.id)
                .single();

            if (error && status !== 406) throw error;

            if (data) {
                setProfile(data);
            }
        } catch (error) {
            if (error instanceof Error) {
                Alert.alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile(updates: any) {
        try {
            setLoading(true);
            if (!session?.user) throw new Error('No user on the session!');

            const { error } = await supabase
                .from('profiles')
                .upsert({ ...updates, id: session.user.id, updated_at: new Date() });

            if (error) throw error;
        } catch (error) {
            if (error instanceof Error) Alert.alert(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View>
                <Avatar
                    size={200}
                    url={profilePic}
                    onUpload={(url: string) => {
                        setProfile({ profilePic: url });
                        updateProfile({ profilePic: url });
                    }}
                />
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Input label="Email" value={session?.user?.email} disabled />
            </View>

            <View style={styles.verticallySpaced}>
                <Input
                    label="Username"
                    value={username}
                    onChangeText={(text) => setProfile({ username: text })}
                />
            </View>

            <View style={styles.verticallySpaced}>
                <Input
                    label="Bio"
                    value={bio}
                    onChangeText={(text) => setProfile({ bio: text })}
                />
            </View>

            <View style={[styles.verticallySpaced, styles.mt20]}>
                <Button
                    title={loading ? 'Loading ...' : 'Update'}
                    onPress={() =>
                        updateProfile({
                            username,
                            profilePic,
                            bio,
                            university,
                            yearLevel,
                            studyPreferences,
                        })
                    }
                    disabled={loading}
                />
            </View>

            <View style={styles.verticallySpaced}>
                <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        padding: 12,
    },
    verticallySpaced: {
        paddingTop: 4,
        paddingBottom: 4,
        alignSelf: 'stretch',
    },
    mt20: {
        marginTop: 20,
    },
});
