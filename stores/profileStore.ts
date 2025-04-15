// stores/profileStore.ts
import { create } from 'zustand';

type StudyPreferences = {
    [key: string]: any;
};

interface ProfileState {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string;
    bio: string;
    university: string;
    year_level: string;
    study_preferences: StudyPreferences;

    setProfile: (profile: Partial<ProfileState>) => void;
    resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
    id: '',
    username: '',
    full_name: '',
    avatar_url: '',
    bio: '',
    university: '',
    year_level: '',
    study_preferences: {},

    setProfile: (profile) => set((state) => ({ ...state, ...profile })),
    resetProfile: () =>
        set({
            id: '',
            username: '',
            full_name: '',
            avatar_url: '',
            bio: '',
            university: '',
            year_level: '',
            study_preferences: {},
        }),
}));
