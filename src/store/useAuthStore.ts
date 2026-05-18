import { create } from 'zustand';
// (removed @ts-nocheck to satisfy lint rules)
// Note: Type checks are preserved.
import { persist } from 'zustand/middleware';


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,
      login: (user, token) => set({ user, isAuthenticated: true, token }),
      logout: () => set({ user: null, isAuthenticated: false, token: null }),
    }),
    {
      name: 'imrs-auth-storage',
    }
  )
);
