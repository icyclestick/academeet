// Dropdown option type for DropDownPicker
export interface DropdownOption {
  label: string;
  value: string;
}

// User profile type for matching and profile fetch
export interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
  university?: string;
  website?: string;
  preferences?: Record<string, any>; // jsonb
  updated_at?: Date;
  // add other columns as needed
}

// For useUniversitiesAndMajors hook
export interface UniversitiesAndMajors {
  universities: DropdownOption[];
  majors: DropdownOption[];
  loading: boolean;
}
