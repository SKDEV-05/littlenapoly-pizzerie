'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  clearFavorites: () => void;
  totalCount: () => number;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],

      isFavorite: (id: number) => {
        return get().favoriteIds.includes(id);
      },

      toggleFavorite: (id: number) => {
        set((state) => {
          const exists = state.favoriteIds.includes(id);
          return {
            favoriteIds: exists
              ? state.favoriteIds.filter((favId) => favId !== id)
              : [...state.favoriteIds, id],
          };
        });
      },

      addFavorite: (id: number) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.includes(id)
            ? state.favoriteIds
            : [...state.favoriteIds, id],
        }));
      },

      removeFavorite: (id: number) => {
        set((state) => ({
          favoriteIds: state.favoriteIds.filter((favId) => favId !== id),
        }));
      },

      clearFavorites: () => {
        set({ favoriteIds: [] });
      },

      totalCount: () => {
        return get().favoriteIds.length;
      },
    }),
    {
      name: 'little_napoli_favorites',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage))),
    }
  )
);
