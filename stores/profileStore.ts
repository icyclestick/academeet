// stores/profileStore.ts
import { create } from 'zustand';

type StudyPreferences = {
    [key: string]: any;
};

interface ProfileState {
    id?: string;
    username?: string;
    fullName?: string;
    website?: string;
    avatarUrl?: string;
    bio?: string;
    university?: string;
    yearLevel?: string;
    studyPreferences?: StudyPreferences;

    setUsername: (username: string) => void;
    setFullName: (fullName: string) => void;
    setWebsite: (website: string) => void;
    setAvatarUrl: (avatarUrl: string) => void;
    setBio: (bio: string) => void;
    setUniversity: (university: string) => void;
    setYearLevel: (yearLevel: string) => void;
    setStudyPreferences: (studyPreferences: StudyPreferences) => void;

    resetProfile: () => void;
}


export const useProfileStore = create<ProfileState>((set) => ({
    id: undefined,
    username: undefined,
    fullName: undefined,
    website: undefined,
    avatarUrl: undefined,
    bio: undefined,
    university: undefined,
    yearLevel: undefined,
    studyPreferences: {},

    setUsername: (username) => set({ username }),
    setFullName: (fullName) => set({ fullName }),
    setWebsite: (website) => set({ website }),
    setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
    setBio: (bio) => set({ bio }),
    setUniversity: (university) => set({ university }),
    setYearLevel: (yearLevel) => set({ yearLevel }),
    setStudyPreferences: (studyPreferences) => set({ studyPreferences }),

    resetProfile: () =>
        set({
            id: undefined,
            username: undefined,
            fullName: undefined,
            website: undefined,
            avatarUrl: undefined,
            bio: undefined,
            university: undefined,
            yearLevel: undefined,
            studyPreferences: {},
        }),
}));
