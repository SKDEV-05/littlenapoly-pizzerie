'use client';

import { create } from 'zustand';

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  unitPrice: number;
  quantity: number;
  isAlcoholic: boolean;
  categorySlug: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalCount: () => number;
  getFinancials: () => {
    subtotal: number;
    foodGross: number;
    foodNet: number;
    foodVat10: number;
    drinkGross: number;
    drinkNet: number;
    drinkVat20: number;
    totalVat: number;
    totalAmount: number;
  };
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalCount: () => {
    return get().items.reduce((acc, i) => acc + i.quantity, 0);
  },

  getFinancials: () => {
    const items = get().items;
    let foodGross = 0;
    let drinkGross = 0;

    for (const item of items) {
      const lineTotal = Math.round(item.unitPrice * item.quantity * 100) / 100;
      if (item.isAlcoholic) {
        drinkGross += lineTotal;
      } else {
        foodGross += lineTotal;
      }
    }

    const foodNet = Math.round((foodGross / 1.1) * 100) / 100;
    const foodVat10 = Math.round((foodGross - foodNet) * 100) / 100;

    const drinkNet = Math.round((drinkGross / 1.2) * 100) / 100;
    const drinkVat20 = Math.round((drinkGross - drinkNet) * 100) / 100;

    const totalAmount = Math.round((foodGross + drinkGross) * 100) / 100;
    const totalVat = Math.round((foodVat10 + drinkVat20) * 100) / 100;

    return {
      subtotal: totalAmount,
      foodGross,
      foodNet,
      foodVat10,
      drinkGross,
      drinkNet,
      drinkVat20,
      totalVat,
      totalAmount,
    };
  },
}));
