'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CANONICAL_MENU_DATA, MenuItemData } from '@/components/sections/MenuGrid';

export type OrderStatus = 'new' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface AdminOrderItem {
  id: number;
  slug?: string;
  name: string;
  unitPrice: number;
  quantity: number;
  isAlcoholic: boolean;
  categorySlug?: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  pickup_time: string;
  payment_method: 'cash_on_pickup' | 'stripe_online';
  payment_status: 'paid' | 'pending';
  status: OrderStatus;
  kitchen_notes?: string;
  items: AdminOrderItem[];
  subtotal: number;
  totalVat: number;
  totalAmount: number;
  created_at: string;
}

export interface AdminReservation {
  id: string;
  reservation_number: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  reserved_date: string;
  time_slot: string;
  special_requests?: string;
  status: ReservationStatus;
  created_at: string;
}

// Pre-seeded realistic orders for Little Napoli
const INITIAL_ORDERS: AdminOrder[] = [
  {
    id: 'ord_101',
    order_number: 'LN-2026-0841',
    customer_name: 'Lukas Steiner',
    customer_email: 'lukas.steiner@wien.at',
    customer_phone: '+43 664 1238901',
    pickup_time: new Date(Date.now() + 25 * 60000).toISOString(),
    payment_method: 'stripe_online',
    payment_status: 'paid',
    status: 'new',
    kitchen_notes: 'Bitte extra knusprig und geschnitten einpacken.',
    items: [
      { id: 1, name: 'Regina Margherita D.O.P.', unitPrice: 11.5, quantity: 2, isAlcoholic: false },
      { id: 14, name: 'Yellow Bufala', unitPrice: 14.8, quantity: 1, isAlcoholic: false },
      { id: 44, name: 'Birra Ichnusa Non Filtrata 0,33L', unitPrice: 4.5, quantity: 2, isAlcoholic: true },
    ],
    subtotal: 46.8,
    totalVat: 5.62,
    totalAmount: 46.8,
    created_at: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: 'ord_102',
    order_number: 'LN-2026-0840',
    customer_name: 'Sophie Brandstätter',
    customer_email: 'sophie.b@gmail.com',
    customer_phone: '+43 676 9876543',
    pickup_time: new Date(Date.now() + 12 * 60000).toISOString(),
    payment_method: 'cash_on_pickup',
    payment_status: 'pending',
    status: 'preparing',
    kitchen_notes: 'Knoblauchöl bitte beilegen.',
    items: [
      { id: 4, name: 'Diabola 2.0 (Scharf)', unitPrice: 14.3, quantity: 1, isAlcoholic: false },
      { id: 40, name: 'Hausgemachtes Tiramisú Classico', unitPrice: 6.5, quantity: 2, isAlcoholic: false },
    ],
    subtotal: 27.3,
    totalVat: 2.48,
    totalAmount: 27.3,
    created_at: new Date(Date.now() - 22 * 60000).toISOString(),
  },
  {
    id: 'ord_103',
    order_number: 'LN-2026-0839',
    customer_name: 'Dr. Michael Huber',
    customer_email: 'm.huber@meduni.at',
    customer_phone: '+43 699 5544332',
    pickup_time: new Date(Date.now() - 5 * 60000).toISOString(),
    payment_method: 'stripe_online',
    payment_status: 'paid',
    status: 'ready',
    kitchen_notes: '',
    items: [
      { id: 20, name: '4 Formaggi con Tartufo', unitPrice: 15.2, quantity: 1, isAlcoholic: false },
      { id: 24, name: 'Burrata Pugliese con Pomodorini', unitPrice: 12.9, quantity: 1, isAlcoholic: false },
    ],
    subtotal: 28.1,
    totalVat: 2.55,
    totalAmount: 28.1,
    created_at: new Date(Date.now() - 40 * 60000).toISOString(),
  },
  {
    id: 'ord_104',
    order_number: 'LN-2026-0838',
    customer_name: 'Elena Rossi',
    customer_email: 'elena.rossi@yahoo.it',
    customer_phone: '+43 650 1122334',
    pickup_time: new Date(Date.now() - 90 * 60000).toISOString(),
    payment_method: 'cash_on_pickup',
    payment_status: 'paid',
    status: 'completed',
    kitchen_notes: 'Perfetto, grazie mille!',
    items: [
      { id: 31, name: 'Lasagne Caserecce della Nonna', unitPrice: 13.9, quantity: 2, isAlcoholic: false },
    ],
    subtotal: 27.8,
    totalVat: 2.53,
    totalAmount: 27.8,
    created_at: new Date(Date.now() - 110 * 60000).toISOString(),
  },
];

// Pre-seeded reservations
const INITIAL_RESERVATIONS: AdminReservation[] = [
  {
    id: 'res_201',
    reservation_number: 'RES-901',
    guest_name: 'Familie Weber',
    guest_email: 'weber.fam@aon.at',
    guest_phone: '+43 676 4433221',
    party_size: 4,
    reserved_date: '2026-09-12',
    time_slot: '19:00',
    special_requests: 'Tisch am Fenster wenn möglich, Hochstuhl benötigt.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'res_202',
    reservation_number: 'RES-902',
    guest_name: 'Florian Gruber (Geburtstag)',
    guest_email: 'florian.gruber@gmx.at',
    guest_phone: '+43 664 8877665',
    party_size: 6,
    reserved_date: '2026-09-12',
    time_slot: '20:30',
    special_requests: 'Geburtstagsfeier, bringen kleinen Kuchen mit.',
    status: 'pending',
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: 'res_203',
    reservation_number: 'RES-903',
    guest_name: 'Anna & David',
    guest_email: 'anna.d@icloud.com',
    guest_phone: '+43 699 1234567',
    party_size: 2,
    reserved_date: '2026-09-13',
    time_slot: '18:30',
    special_requests: 'Ruhige Ecke für Jahrestag.',
    status: 'confirmed',
    created_at: new Date(Date.now() - 200 * 60000).toISOString(),
  },
];

interface AdminState {
  orders: AdminOrder[];
  reservations: AdminReservation[];
  customMenuItems: MenuItemData[];

  // Order actions
  addOrder: (order: Omit<AdminOrder, 'id' | 'created_at'>) => AdminOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Reservation actions
  addReservation: (reservation: Omit<AdminReservation, 'id' | 'created_at'>) => AdminReservation;
  updateReservationStatus: (resId: string, status: ReservationStatus) => void;
  deleteReservation: (resId: string) => void;

  // Menu actions
  addMenuItem: (item: Omit<MenuItemData, 'id'>) => MenuItemData;
  updateMenuItem: (id: number, updates: Partial<MenuItemData>) => void;
  deleteMenuItem: (id: number) => void;
  resetMenuToDefault: () => void;

  // Analytics Helpers
  getMetrics: () => {
    totalRevenue: number;
    todayOrdersCount: number;
    pendingOrdersCount: number;
    confirmedReservationsCount: number;
  };
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      orders: INITIAL_ORDERS,
      reservations: INITIAL_RESERVATIONS,
      customMenuItems: CANONICAL_MENU_DATA,

      addOrder: (orderData) => {
        const newOrder: AdminOrder = {
          ...orderData,
          id: `ord_${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ orders: [newOrder, ...state.orders] }));
        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status,
                  payment_status: status === 'completed' ? 'paid' : o.payment_status,
                }
              : o
          ),
        }));
      },

      deleteOrder: (orderId) => {
        set((state) => ({ orders: state.orders.filter((o) => o.id !== orderId) }));
      },

      addReservation: (resData) => {
        const newRes: AdminReservation = {
          ...resData,
          id: `res_${Date.now()}`,
          created_at: new Date().toISOString(),
        };
        set((state) => ({ reservations: [newRes, ...state.reservations] }));
        return newRes;
      },

      updateReservationStatus: (resId, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === resId ? { ...r, status } : r
          ),
        }));
      },

      deleteReservation: (resId) => {
        set((state) => ({ reservations: state.reservations.filter((r) => r.id !== resId) }));
      },

      addMenuItem: (itemData) => {
        const nextId = Math.max(...get().customMenuItems.map((i) => i.id), 0) + 1;
        const newItem: MenuItemData = {
          ...itemData,
          id: nextId,
        };
        set((state) => ({ customMenuItems: [newItem, ...state.customMenuItems] }));
        return newItem;
      },

      updateMenuItem: (id, updates) => {
        set((state) => ({
          customMenuItems: state.customMenuItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      deleteMenuItem: (id) => {
        set((state) => ({
          customMenuItems: state.customMenuItems.filter((item) => item.id !== id),
        }));
      },

      resetMenuToDefault: () => {
        set({ customMenuItems: CANONICAL_MENU_DATA });
      },

      getMetrics: () => {
        const orders = get().orders;
        const reservations = get().reservations;

        const totalRevenue = orders
          .filter((o) => o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const pendingOrdersCount = orders.filter(
          (o) => o.status === 'new' || o.status === 'preparing' || o.status === 'ready'
        ).length;

        const confirmedReservationsCount = reservations.filter(
          (r) => r.status === 'confirmed'
        ).length;

        return {
          totalRevenue,
          todayOrdersCount: orders.length,
          pendingOrdersCount,
          confirmedReservationsCount,
        };
      },
    }),
    {
      name: 'little_napoli_admin_data',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : ({} as Storage))),
    }
  )
);
