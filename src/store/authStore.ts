import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  smartAccountAddress: string | null;
  setUser: (user: User | null) => void;
  setSmartAccountAddress: (address: string | null) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      smartAccountAddress: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setSmartAccountAddress: (address) => set({ smartAccountAddress: address }),
      logout: () => set({ user: null, isAuthenticated: false, smartAccountAddress: null }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        smartAccountAddress: state.smartAccountAddress,
      }),
    }
  )
);