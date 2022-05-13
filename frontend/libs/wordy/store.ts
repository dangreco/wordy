import createVanilla from 'zustand/vanilla';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Wordy } from './types';

export const authStore = createVanilla<Partial<Wordy.Auth>>(persist(
  (set, get) => ({}),
  { name: 'wordy-auth' }
));


interface UserStore {
  user?: Wordy.User;
  setUser(user: Wordy.User | undefined): void;
}

export const useUserStore = create<UserStore>(
  (set) => ({ 
    user: undefined,
    setUser: (user) => set({ user }),
  }),
);