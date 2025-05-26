export interface StudyPreferences {
    yearLevel: string;
    preferredTime?: string;
    accountabilityLevel?: string;
    matchPreference?: string;
}

export interface ProfileState {
    id?: string;
    username?: string;
    fullName?: string;
    website?: string;
    avatarUrl?: string;
    bio?: string;
    university?: string;
    studyPreferences: StudyPreferences;

    matchedBuddy?: any;
    setMatchedBuddy: (buddy: any) => void;
    resetBuddy: () => void;

    setUsername: (username: string) => void;
    setFullName: (fullName: string) => void;
    setWebsite: (website: string) => void;
    setAvatarUrl: (avatarUrl: string) => void;
    setBio: (bio: string) => void;
    setUniversity: (university: string) => void;
    setStudyPreferences: (prefs: StudyPreferences) => void;
    setPreferredTime: (time: string) => void;
    setAccountabilityLevel: (level: string) => void;
    setMatchPreference: (preference: string) => void;
    resetProfile: () => void;
}
