// stores/profileStore.ts
import { create } from 'zustand';
import {ProfileState} from "@/types/Profile";




export const useProfileStore = create<ProfileState>((set) => ({
    id: undefined,
    username: undefined,
    fullName: undefined,
    website: undefined,
    avatarUrl: undefined,
    bio: undefined,
    university: undefined,
    studyPreferences: { yearLevel: '', preferredTime: '', accountabilityLevel: '', matchPreference: '' },
    matchedBuddy: undefined,

    setUsername: (username) => set({ username }),
    setFullName: (fullName) => set({ fullName }),
    setWebsite: (website) => set({ website }),
    setAvatarUrl: (avatarUrl) => set({ avatarUrl }),
    setBio: (bio) => set({ bio }),
    setUniversity: (university) => set({ university }),

    setStudyPreferences: (prefs) => set({ studyPreferences: prefs }),

    setPreferredTime: (time) =>
        set((state) => ({
            studyPreferences: { ...state.studyPreferences, preferredTime: time },
        })),
    setAccountabilityLevel: (level) =>
        set((state) => ({
            studyPreferences: { ...state.studyPreferences, accountabilityLevel: level },
        })),
    setMatchPreference: (preference) =>
        set((state) => ({
            studyPreferences: { ...state.studyPreferences, matchPreference: preference },
        })),
    setYearLevel: (yearLevel) =>
        set((state) => ({
            studyPreferences: { ...state.studyPreferences, yearLevel },
        })),
    setMatchedBuddy: (buddy) => set({ matchedBuddy: buddy }),
    resetBuddy: () => set({ matchedBuddy: undefined }),

    resetProfile: () =>
        set({
            id: undefined,
            username: undefined,
            fullName: undefined,
            website: undefined,
            avatarUrl: undefined,
            bio: undefined,
            university: undefined,
            studyPreferences: { yearLevel: '', preferredTime: '', accountabilityLevel: '', matchPreference: '' },
            matchedBuddy: undefined,
        }),
}));
