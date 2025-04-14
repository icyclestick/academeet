import { create } from 'zustand';

type AuthState = {
    email: string;
    code: string;
    name: string;
    username: string;
    password: string;
    isLoading: boolean;
    setEmail: (email: string) => void;
    setName: (name: string) => void;
    setCode: (code: string) => void;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    email: '',
    code: '',
    name: '',
    username: '',
    password: '',
    isLoading: false,
    setEmail: (email) => set({ email }),
    setCode: (code) => set({ code }),
    setName: (name) => set({ name }),
    setUsername: (username) => set({ username }),
    setPassword: (password) => set({ password }),
    resetAuth: () => set({
        email: '',
        code: '',
        name: '',
        username: '',
        password: '',
    }),
}));
