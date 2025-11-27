import { create } from 'zustand';
import api from '../services/api';

interface User {
    id: number;
    email: string;
    full_name: string;
    role: 'PASSENGER' | 'DRIVER';
    profile_photo?: string;
    car_info?: any;
    is_verified?: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
    login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
    },
    checkAuth: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const response = await api.get('/auth/me');
            set({ user: response.data, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('token');
            set({ token: null, user: null, isAuthenticated: false });
        }
    },
}));
