'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
  favoriteIds?: number[];
}

// Initial pre-configured accounts
const SEED_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_admin_01',
    name: 'Little Napoli Admin',
    email: 'admin@littlenapoli.at',
    phone: '+43 2235 42733',
    role: 'admin',
    createdAt: '2026-01-01T10:00:00.000Z',
    passwordHash: 'admin123',
    favoriteIds: [1, 2],
  },
  {
    id: 'usr_cust_01',
    name: 'Maximilian Mustermann',
    email: 'kunde@example.at',
    phone: '+43 676 1234567',
    role: 'customer',
    createdAt: '2026-02-15T14:30:00.000Z',
    passwordHash: 'kunde123',
    favoriteIds: [2, 5],
  },
];

interface AuthState {
  currentUser: User | null;
  registeredUsers: (User & { passwordHash: string })[];
  isAuthModalOpen: boolean;
  authModalTab: 'signin' | 'signup';
  authRedirectCallback?: string | null;
  authPromptMessage?: string | null;

  openAuthModal: (tab?: 'signin' | 'signup', redirectCallback?: string | null, promptMessage?: string | null) => void;
  closeAuthModal: () => void;
  toggleFavorite: (dishId: number) => { success: boolean; requiresAuth?: boolean };
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsAdminDemo: () => Promise<void>;
  loginAsCustomerDemo: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      registeredUsers: SEED_USERS,
      isAuthModalOpen: false,
      authModalTab: 'signin',
      authRedirectCallback: null,
      authPromptMessage: null,

      openAuthModal: (tab = 'signin', redirectCallback = null, promptMessage = null) => {
        set({
          isAuthModalOpen: true,
          authModalTab: tab,
          authRedirectCallback: redirectCallback,
          authPromptMessage: promptMessage,
        });
      },

      closeAuthModal: () => {
        set({ isAuthModalOpen: false, authRedirectCallback: null, authPromptMessage: null });
      },

      toggleFavorite: (dishId: number) => {
        const user = get().currentUser;
        if (!user) {
          get().openAuthModal(
            'signin',
            null,
            'Bitte melden Sie sich an, um Gerichte in Ihren persönlichen Favoriten zu speichern ❤️'
          );
          return { success: false, requiresAuth: true };
        }

        const currentFavs = user.favoriteIds || [];
        const isFav = currentFavs.includes(dishId);
        const newFavs = isFav ? currentFavs.filter((id) => id !== dishId) : [...currentFavs, dishId];

        const updatedUser: User = { ...user, favoriteIds: newFavs };
        const updatedUsers = get().registeredUsers.map((u) =>
          u.id === user.id ? { ...u, favoriteIds: newFavs } : u
        );

        set({
          currentUser: updatedUser,
          registeredUsers: updatedUsers,
        });

        return { success: true, requiresAuth: false };
      },

      login: async (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = get().registeredUsers;

        const foundUser = users.find(
          (u) => u.email.toLowerCase() === normalizedEmail && (u.passwordHash === password || (normalizedEmail === 'admin@littlenapoli.at' && (password === 'admin123' || password === 'napoli2026')))
        );

        if (!foundUser) {
          return {
            success: false,
            error: 'Ungültige E-Mail-Adresse oder Passwort / Invalid credentials.',
          };
        }

        const { passwordHash, ...userWithoutPassword } = foundUser;
        set({ currentUser: userWithoutPassword, isAuthModalOpen: false });
        return { success: true };
      },

      register: async (name: string, email: string, phone: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase();
        const users = get().registeredUsers;

        if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
          return {
            success: false,
            error: 'Diese E-Mail-Adresse ist bereits registriert / Email already exists.',
          };
        }

        const newUser: User & { passwordHash: string } = {
          id: `usr_${Date.now()}`,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone.trim(),
          role: 'customer',
          createdAt: new Date().toISOString(),
          passwordHash: password,
        };

        const updatedUsers = [...users, newUser];
        const { passwordHash, ...userWithoutPassword } = newUser;

        set({
          registeredUsers: updatedUsers,
          currentUser: userWithoutPassword,
          isAuthModalOpen: false,
        });

        return { success: true };
      },

      logout: () => {
        set({ currentUser: null });
      },

      loginAsAdminDemo: async () => {
        const admin = get().registeredUsers.find((u) => u.role === 'admin') || SEED_USERS[0];
        const { passwordHash, ...userWithoutPassword } = admin;
        set({ currentUser: userWithoutPassword, isAuthModalOpen: false });
      },

      loginAsCustomerDemo: async () => {
        const customer = get().registeredUsers.find((u) => u.role === 'customer') || SEED_USERS[1];
        const { passwordHash, ...userWithoutPassword } = customer;
        set({ currentUser: userWithoutPassword, isAuthModalOpen: false });
      },
    }),
    {
      name: 'little_napoli_auth',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage))),
    }
  )
);
