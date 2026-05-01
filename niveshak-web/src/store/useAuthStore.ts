import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isGuest: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setGuest: (isGuest: boolean) => void;
}

export const useAuthStore = create<AuthState>()(set => ({
  user:      null,
  isLoading: true,   // true until Supabase session is hydrated on mount
  isGuest:   false,
  setUser:    user      => set({ user }),
  setLoading: isLoading => set({ isLoading }),
  setGuest:   isGuest   => set({ isGuest }),
}));
