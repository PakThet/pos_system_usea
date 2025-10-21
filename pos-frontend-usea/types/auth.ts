'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

export interface User {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: 'active' | 'inactive';
  role: 'cashier' | 'manager' | 'admin';
  shift: 'morning' | 'evening' | 'night';
  permissions: string[];
  last_login_at?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hydrated: boolean; // track if Zustand store is ready
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hydrated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data.data;

          localStorage.setItem('auth_token', token);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
          set({ isLoading: false });
          throw new Error(error.response?.data?.message || 'Login failed');
        }
      },

      logout: async () => {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false });
          // window.location.href = '/login';
        }
      },

      checkAuth: async () => {
        if (typeof window === 'undefined') return;

        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, hydrated: true });
          return;
        }

        set({ isLoading: true });
        try {
          const response = await api.get('/auth/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: response.data.data, isAuthenticated: true, isLoading: false, hydrated: true });
        } catch (error) {
          localStorage.removeItem('auth_token');
          set({ user: null, isAuthenticated: false, isLoading: false, hydrated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        hydrated: state.hydrated,
      }),
    }
  )
);
