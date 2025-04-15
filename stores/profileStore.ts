import { create } from 'zustand'

type StudyPreferences = {
    // Define keys/types depending on what’s in the quiz
    [key: string]: any
}

interface ProfileState {
    username: string
    name: string
    profilePic?: string
    bio?: string
    university?: string
    yearLevel?: string
    studyPreferences?: StudyPreferences

    setProfile: (profile: Partial<ProfileState>) => void
    resetProfile: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
    username: '',
    name: '',
    profilePic: undefined,
    bio: undefined,
    university: undefined,
    yearLevel: undefined,
    studyPreferences: {},

    setProfile: (profile) => set((state) => ({ ...state, ...profile })),
    resetProfile: () =>
        set({
            username: '',
            name: '',
            profilePic: undefined,
            bio: undefined,
            university: undefined,
            yearLevel: undefined,
            studyPreferences: {},
        }),
}))
