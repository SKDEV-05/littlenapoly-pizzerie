import { create } from 'zustand';

interface MenuBookState {
  isOpen: boolean;
  currentPage: number;
  open: (page?: number) => void;
  close: () => void;
  setPage: (page: number) => void;
}

export const useMenuBookStore = create<MenuBookState>((set) => ({
  isOpen: false,
  currentPage: 1,
  open: (page = 1) => set({ isOpen: true, currentPage: page }),
  close: () => set({ isOpen: false }),
  setPage: (page: number) => set({ currentPage: page }),
}));
