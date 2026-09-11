'use client';

import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface FavoritesState {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => boolean;
  addFavorite: (id: number) => boolean;
  removeFavorite: (id: number) => boolean;
  clearFavorites: () => void;
  totalCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()((set, get) => ({
  favoriteIds: [],

  isFavorite: (id: number) => {
    const user = useAuthStore.getState().currentUser;
    if (!user) return false;
    return (user.favoriteIds || []).includes(id);
  },

  toggleFavorite: (id: number) => {
    const res = useAuthStore.getState().toggleFavorite(id);
    if (res.success) {
      const user = useAuthStore.getState().currentUser;
      set({ favoriteIds: user?.favoriteIds || [] });
      return true;
    }
    return false;
  },

  addFavorite: (id: number) => {
    const user = useAuthStore.getState().currentUser;
    if (!user) {
      useAuthStore.getState().openAuthModal(
        'signin',
        null,
        'Bitte melden Sie sich an, um Gerichte in Ihren persönlichen Favoriten zu speichern ❤️'
      );
      return false;
    }
    if (!(user.favoriteIds || []).includes(id)) {
      useAuthStore.getState().toggleFavorite(id);
      set({ favoriteIds: useAuthStore.getState().currentUser?.favoriteIds || [] });
    }
    return true;
  },

  removeFavorite: (id: number) => {
    const user = useAuthStore.getState().currentUser;
    if (user && (user.favoriteIds || []).includes(id)) {
      useAuthStore.getState().toggleFavorite(id);
      set({ favoriteIds: useAuthStore.getState().currentUser?.favoriteIds || [] });
      return true;
    }
    return false;
  },

  clearFavorites: () => {
    set({ favoriteIds: [] });
  },

  totalCount: () => {
    const user = useAuthStore.getState().currentUser;
    return user ? (user.favoriteIds || []).length : 0;
  },
}));

// Automatically synchronize useFavoritesStore whenever useAuthStore changes (login, logout, account switch)
if (typeof window !== 'undefined') {
  useAuthStore.subscribe((state) => {
    const userFavs = state.currentUser ? (state.currentUser.favoriteIds || []) : [];
    useFavoritesStore.setState({ favoriteIds: userFavs });
  });

  // Initial synchronization on client hydration
  const initialUser = useAuthStore.getState().currentUser;
  if (initialUser) {
    useFavoritesStore.setState({ favoriteIds: initialUser.favoriteIds || [] });
  }
}
