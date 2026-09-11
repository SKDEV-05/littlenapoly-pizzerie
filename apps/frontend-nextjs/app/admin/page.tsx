'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore, User } from '@/lib/authStore';
import { useAdminStore, AdminOrder, AdminReservation, OrderStatus, ReservationStatus } from '@/lib/adminStore';
import { useTheme } from '@/lib/theme';
import { MenuItemData } from '@/components/sections/MenuGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ShieldCheck,
  Lock,
  LayoutDashboard,
  ShoppingBag,
  CalendarDays,
  UtensilsCrossed,
  Users,
  Search,
  Plus,
  Edit2,
  Trash2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Sun,
  Moon,
  LogOut,
  RefreshCw,
  X,
  Phone,
  Mail,
  ChefHat,
  PackageCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

type AdminTab = 'overview' | 'orders' | 'reservations' | 'menu' | 'users';

export default function AdminDashboardPage() {
  const { theme, toggleTheme } = useTheme();

  const currentUser = useAuthStore((state) => state.currentUser);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const registeredUsers = useAuthStore((state) => state.registeredUsers);

  const {
    orders,
    reservations,
    customMenuItems,
    updateOrderStatus,
    deleteOrder,
    updateReservationStatus,
    deleteReservation,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    resetMenuToDefault,
    getMetrics,
  } = useAdminStore();

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Admin Login Form State
  const [adminEmail, setAdminEmail] = useState('admin@littlenapoli.at');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Filters State
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<string>('all');
  const [menuSearch, setMenuSearch] = useState('');

  // Modals State
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [isAddDishModalOpen, setIsAddDishModalOpen] = useState(false);
  const [newDishForm, setNewDishForm] = useState({
    name: '',
    categorySlug: 'le-pizze-classiche',
    price: 13.5,
    ingredients: '',
    ingredientsEn: '',
    isAlcoholic: false,
    imageSrc: '/images/pizza-margherita.jpg',
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const metrics = getMetrics();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    const res = await login(adminEmail, adminPassword);
    if (!res.success) {
      setLoginError(res.error || 'Ungültige Admin-Anmeldedaten');
    } else {
      const user = useAuthStore.getState().currentUser;
      if (user?.role !== 'admin') {
        setLoginError('Dieses Konto besitzt keine Administrator-Rechte.');
      }
    }
    setLoginLoading(false);
  };

  // 1. ACCESS GATE: If not logged in as Admin
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0E0A08] flex items-center justify-center p-6">
        <div className="animate-pulse text-sm text-stone-500 font-mono">Little Napoli Portal wird geladen...</div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-stone-100 to-[#F5ECE1] dark:from-[#0E0A08] dark:via-[#140F0C] dark:to-[#0A0706] flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-[#18120E] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/50">
              Geschützter Admin-Bereich
            </span>
            <h1 className="font-playfair italic text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              Little Napoli Admin
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
              Melden Sie sich mit Administrator-Rechten an, um Bestellungen, Tische und Speisen zu verwalten.
            </p>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium">
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Admin E-Mail
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="pl-10 h-11 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                  placeholder="admin@littlenapoli.at"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Passwort
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="pl-10 h-11 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg cursor-pointer transition-all"
            >
              {loginLoading ? 'Anmeldung wird geprüft...' : 'Als Administrator anmelden'}
            </Button>
          </form>

          <div className="pt-2 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 dark:hover:text-stone-200 font-medium transition-colors"
            >
              <span>← Zurück zum Restaurant</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN DASHBOARD INTERFACE (SINGLE UNIFIED RESPONSIVE NAVBAR)
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0C0907] text-stone-900 dark:text-stone-100 transition-colors duration-300 flex flex-col">
      
      {/* SINGLE DEDICATED ADMIN HEADER & TABS NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#15100D]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Top Control Bar */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-3">
          
          {/* Brand & Admin Status */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-red-500/30 shadow-xs shrink-0 bg-black">
              <Image src="/images/logo.jpg" alt="Little Napoli" fill className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-playfair italic font-bold text-lg sm:text-xl text-stone-900 dark:text-white leading-none">
                  Little Napoli
                </span>
                <span className="bg-red-600 text-white text-[9.5px] font-extrabold px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono hidden sm:inline-block mt-0.5">
                Verwaltung • Himberg bei Wien
              </span>
            </div>
          </div>

          {/* Quick Actions Center: Live Store, Theme, Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Live Store */}
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 bg-stone-100 dark:bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-800 transition-colors"
              title="Öffentliche Restaurant-Website im neuen Tab öffnen"
            >
              <span>Zur Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              aria-label="Design umschalten"
              title="Design umschalten"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-700" />}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/50 transition-colors cursor-pointer"
              title="Als Administrator abmelden"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Abmelden</span>
            </button>
          </div>
        </div>

        {/* Responsive Tabs Navigation Bar */}
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 pb-2.5 pt-1 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 min-w-max text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-[#18120E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Übersicht</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-[#18120E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bestellungen</span>
              {metrics.pendingOrdersCount > 0 && (
                <span className="bg-amber-400 text-stone-900 text-[10px] font-mono px-1.5 py-0.2 rounded-full font-extrabold">
                  {metrics.pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reservations'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-[#18120E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>Tischreservierungen</span>
              {reservations.filter((r) => r.status === 'pending').length > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-mono px-1.5 py-0.2 rounded-full font-extrabold">
                  {reservations.filter((r) => r.status === 'pending').length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('menu')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'menu'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-[#18120E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Speisekarte &amp; Gerichte</span>
              <span className="text-[10px] text-stone-400 font-mono">({customMenuItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 dark:bg-[#18120E] text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 border border-stone-200 dark:border-stone-800'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Kunden &amp; Benutzer</span>
              <span className="text-[10px] text-stone-400 font-mono">({registeredUsers.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN ADMIN WORKSPACE */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 space-y-6">

        {/* ============================================================ */}
        {/* TAB 1: ÜBERSICHT & STATISTIKEN                                */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Gesamtumsatz */}
              <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                    Gesamtumsatz
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-poppins text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                    {formatEuro(metrics.totalRevenue)}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    inkl. 10% &amp; 20% österreichischer USt
                  </span>
                </div>
              </Card>

              {/* Bestellungen Gesamt */}
              <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                    Bestellungen Gesamt
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/40 text-napoli-red dark:text-red-400 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-poppins text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                    {metrics.todayOrdersCount}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {metrics.pendingOrdersCount} offene Bestellungen in Bearbeitung
                  </span>
                </div>
              </Card>

              {/* Bestätigte Tische */}
              <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                    Bestätigte Tische
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-poppins text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                    {metrics.confirmedReservationsCount}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {reservations.length} Reservierungsanfragen gesamt
                  </span>
                </div>
              </Card>

              {/* Registrierte Kunden */}
              <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-stone-500 dark:text-stone-400 tracking-wider">
                    Registrierte Kunden
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="font-poppins text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                    {registeredUsers.length}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    Kundenkonten &amp; Administratoren
                  </span>
                </div>
              </Card>

            </div>

            {/* Quick Actions & Recent Orders Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Recent Orders Feed */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-bold text-lg text-stone-900 dark:text-white">
                    Aktuelle Bestelleingänge
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-napoli-red hover:underline cursor-pointer"
                  >
                    Alle Bestellungen verwalten →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((order) => (
                    <Card key={order.id} className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-napoli-red/40 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-stone-900 dark:text-white">
                              {order.order_number}
                            </span>
                            <OrderStatusBadge status={order.status} />
                          </div>
                          <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                            {order.customer_name} • <span className="font-mono text-xs text-stone-400">{order.customer_phone}</span>
                          </div>
                          <div className="text-xs text-stone-500 dark:text-stone-400">
                            {order.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-stone-100 dark:border-stone-800">
                          <span className="font-poppins font-extrabold text-base text-stone-900 dark:text-white">
                            {formatEuro(order.totalAmount)}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Abholung: {new Date(order.pickup_time).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr
                          </span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Right Column: Restaurant Shortcuts */}
              <div className="lg:col-span-4 space-y-4">
                <h3 className="font-poppins font-bold text-lg text-stone-900 dark:text-white">
                  Schnellzugriff
                </h3>

                <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('menu');
                      setIsAddDishModalOpen(true);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white">
                          Neues Gericht anlegen
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Pizza, Pasta oder Dessert hinzufügen
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('reservations')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <CalendarDays className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white">
                          Tischreservierungen prüfen
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Gästeliste &amp; Zeitfenster
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('users')}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-left cursor-pointer border border-stone-200/60 dark:border-stone-800"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white">
                          Kunden &amp; Zugänge
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Konten und Kontaktdaten
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </button>
                </Card>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: BESTELLUNGEN (LIVE ORDERS)                            */}
        {/* ============================================================ */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Toolbar: Status Filter Buttons & Search */}
            <div className="bg-white dark:bg-[#18120E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Field */}
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <Input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Bestellnummer oder Kundenname suchen..."
                    className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs rounded-xl"
                  />
                  {orderSearch && (
                    <button type="button" onClick={() => setOrderSearch('')} className="absolute right-3 top-3 text-stone-400 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
                  {(['all', 'new', 'preparing', 'ready', 'completed', 'cancelled'] as (string | OrderStatus)[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                        orderStatusFilter === st
                          ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black shadow-xs'
                          : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      {st === 'all'
                        ? 'Alle'
                        : st === 'new'
                        ? 'Neu'
                        : st === 'preparing'
                        ? 'In Zubereitung'
                        : st === 'ready'
                        ? 'Abholbereit'
                        : st === 'completed'
                        ? 'Abgeschlossen'
                        : 'Storniert'}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {orders
                .filter((o) => {
                  if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                  if (orderSearch.trim()) {
                    const q = orderSearch.toLowerCase();
                    return o.order_number.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((order) => (
                  <Card key={order.id} className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
                    <CardHeader className="p-4 sm:p-5 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-sm text-stone-900 dark:text-white">
                            {order.order_number}
                          </span>
                          <OrderStatusBadge status={order.status} />
                          <span className="text-[10px] text-stone-400 font-mono">
                            {new Date(order.created_at).toLocaleTimeString('de-AT', { hour: '2-digit', minute: '2-digit' })} Uhr
                          </span>
                        </div>
                        <div className="text-xs text-stone-600 dark:text-stone-300 font-semibold mt-0.5">
                          {order.customer_name} • <a href={`tel:${order.customer_phone}`} className="text-napoli-red font-mono hover:underline">{order.customer_phone}</a> • <span className="font-mono text-stone-400">{order.customer_email}</span>
                        </div>
                      </div>

                      {/* Status Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {order.status === 'new' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs gap-1 rounded-xl shadow-xs cursor-pointer"
                          >
                            <ChefHat className="w-3.5 h-3.5" />
                            <span>In Zubereitung</span>
                          </Button>
                        )}

                        {order.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs gap-1 rounded-xl shadow-xs cursor-pointer"
                          >
                            <PackageCheck className="w-3.5 h-3.5" />
                            <span>Abholbereit</span>
                          </Button>
                        )}

                        {order.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1 rounded-xl shadow-xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Abschließen</span>
                          </Button>
                        )}

                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="border-red-200 text-red-600 dark:border-red-900/50 hover:bg-red-50 text-xs rounded-xl cursor-pointer"
                          >
                            Stornieren
                          </Button>
                        )}

                        <button
                          type="button"
                          onClick={() => deleteOrder(order.id)}
                          className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                          title="Löschen"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 space-y-3">
                      {/* Products List */}
                      <div className="divide-y divide-stone-100 dark:divide-stone-800/60 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="py-2 flex items-center justify-between gap-2 first:pt-0 last:pb-0">
                            <span className="font-semibold text-stone-800 dark:text-stone-200">
                              <strong className="text-napoli-red font-mono mr-1.5">{item.quantity}x</strong>
                              {item.name}
                            </span>
                            <span className="font-mono text-stone-600 dark:text-stone-400">
                              {formatEuro(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Kitchen Notes */}
                      {order.kitchen_notes && (
                        <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                          <strong>Hinweis an Küche:</strong> {order.kitchen_notes}
                        </div>
                      )}

                      {/* Total & Tax breakdown footer */}
                      <div className="pt-2 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                        <div className="text-stone-400 font-mono">
                          Zahlung: <span className="capitalize font-bold text-stone-700 dark:text-stone-300">{order.payment_method === 'cash_on_pickup' ? 'Bar bei Abholung' : 'Stripe Online'}</span> ({order.payment_status === 'paid' ? 'Bezahlt' : 'Offen bei Abholung'})
                        </div>
                        <div className="text-right">
                          <span className="text-stone-500 text-[11px] mr-2">Gesamt:</span>
                          <span className="font-poppins font-extrabold text-base text-stone-900 dark:text-white">
                            {formatEuro(order.totalAmount)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: TISCHRESERVIERUNGEN                                   */}
        {/* ============================================================ */}
        {activeTab === 'reservations' && (
          <div className="space-y-6">
            
            <div className="bg-white dark:bg-[#18120E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-stone-800 dark:text-stone-200">
                  Status-Filter:
                </span>
                {(['all', 'pending', 'confirmed', 'cancelled'] as (string | ReservationStatus)[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setResStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl capitalize text-xs font-bold transition-all cursor-pointer ${
                      resStatusFilter === st
                        ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {st === 'all' ? 'Alle' : st === 'pending' ? 'Ausstehend' : st === 'confirmed' ? 'Bestätigt' : 'Storniert'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reservations
                .filter((r) => resStatusFilter === 'all' || r.status === resStatusFilter)
                .map((res) => (
                  <Card key={res.id} className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-stone-400">
                        {res.reservation_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          res.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-300'
                            : res.status === 'pending'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-300 animate-pulse'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        {res.status === 'confirmed' ? 'Bestätigt' : res.status === 'pending' ? 'Ausstehend' : 'Storniert'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-bold text-base text-stone-900 dark:text-white">
                        {res.guest_name}
                      </h4>
                      <div className="text-xs text-stone-500 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-napoli-red" />
                          <span className="font-bold text-stone-800 dark:text-stone-200">{res.party_size} Personen</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
                          <span>{res.reserved_date} um {res.time_slot} Uhr</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-stone-400" />
                          <a href={`tel:${res.guest_phone}`} className="hover:underline">{res.guest_phone}</a>
                        </div>
                      </div>
                    </div>

                    {res.special_requests && (
                      <div className="p-2 rounded-lg bg-stone-50 dark:bg-stone-900 text-xs text-stone-600 dark:text-stone-400 border border-stone-200/50 dark:border-stone-800">
                        &quot;{res.special_requests}&quot;
                      </div>
                    )}

                    <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                      {res.status !== 'confirmed' && (
                        <Button
                          size="sm"
                          onClick={() => updateReservationStatus(res.id, 'confirmed')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                        >
                          Bestätigen
                        </Button>
                      )}
                      {res.status !== 'cancelled' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateReservationStatus(res.id, 'cancelled')}
                          className="text-xs text-red-600 border-red-200 dark:border-red-900 rounded-xl cursor-pointer"
                        >
                          Stornieren
                        </Button>
                      )}
                      <button
                        type="button"
                        onClick={() => deleteReservation(res.id)}
                        className="p-1.5 text-stone-400 hover:text-red-500 cursor-pointer"
                        title="Löschen"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Card>
                ))}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: SPEISEKARTE & GERICHTE                                 */}
        {/* ============================================================ */}
        {activeTab === 'menu' && (
          <div className="space-y-6">
            
            {/* Menu Toolbar */}
            <div className="bg-white dark:bg-[#18120E] p-4 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <Input
                    type="text"
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    placeholder="Gericht oder Zutat suchen..."
                    className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setIsAddDishModalOpen(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs gap-1.5 rounded-xl shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neues Gericht anlegen</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetMenuToDefault}
                  className="border-stone-300 dark:border-stone-700 text-xs rounded-xl cursor-pointer"
                  title="Auf Standard zurücksetzen"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-stone-400" />
                </Button>
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {customMenuItems
                .filter((item) => {
                  if (menuSearch.trim()) {
                    const q = menuSearch.toLowerCase();
                    return item.name.toLowerCase().includes(q) || item.ingredients.toLowerCase().includes(q);
                  }
                  return true;
                })
                .map((item) => (
                  <Card key={item.id} className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
                    <div className="relative w-full aspect-[4/3] bg-stone-100 dark:bg-stone-900">
                      <Image
                        src={item.imageSrc || '/images/pizza-margherita.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 300px"
                      />
                      <span className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white uppercase tracking-wider">
                        {item.categorySlug.replace(/-/g, ' ')}
                      </span>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <h4 className="font-poppins font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight">
                          {item.ingredients}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                        <span className="font-poppins font-extrabold text-base text-napoli-red dark:text-red-400">
                          {formatEuro(item.price)}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
                            title="Bearbeiten"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteMenuItem(item.id)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
                            title="Löschen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: KUNDEN & BENUTZERKONTEN                               */}
        {/* ============================================================ */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            
            <Card className="bg-white dark:bg-[#18120E] border-stone-200 dark:border-stone-800 rounded-2xl shadow-xs overflow-hidden">
              <CardHeader className="p-5 border-b border-stone-100 dark:border-stone-800">
                <CardTitle className="text-lg font-bold text-stone-900 dark:text-white">
                  Registrierte Benutzer &amp; Kundenkonten
                </CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  Übersicht aller Benutzer, Administrator-Rollen und Kundendaten
                </CardDescription>
              </CardHeader>
              
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {registeredUsers.map((user) => (
                  <div key={user.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold flex items-center justify-center">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-900 dark:text-white">
                            {user.name}
                          </span>
                          <span
                            className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              user.role === 'admin'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 font-extrabold'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                            }`}
                          >
                            {user.role}
                          </span>
                        </div>
                        <div className="text-xs text-stone-500 font-mono mt-0.5">
                          {user.email} • {user.phone}
                        </div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right text-xs text-stone-400 font-mono">
                      Registriert: {new Date(user.createdAt).toLocaleDateString('de-AT')}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        )}

      </div>

      {/* ============================================================ */}
      {/* MODAL: NEUES GERICHT HINZUFÜGEN                                */}
      {/* ============================================================ */}
      {isAddDishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#18120E] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-bold text-lg text-stone-900 dark:text-white">
                Neues Gericht anlegen
              </h3>
              <button type="button" onClick={() => setIsAddDishModalOpen(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addMenuItem({
                  slug: newDishForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  name: newDishForm.name,
                  categorySlug: newDishForm.categorySlug,
                  ingredients: newDishForm.ingredients,
                  ingredientsEn: newDishForm.ingredientsEn || newDishForm.ingredients,
                  price: Number(newDishForm.price),
                  isAlcoholic: newDishForm.isAlcoholic,
                  allergens: ['A', 'G'],
                  imageSrc: newDishForm.imageSrc,
                });
                setIsAddDishModalOpen(false);
                setNewDishForm({
                  name: '',
                  categorySlug: 'le-pizze-classiche',
                  price: 13.5,
                  ingredients: '',
                  ingredientsEn: '',
                  isAlcoholic: false,
                  imageSrc: '/images/pizza-margherita.jpg',
                });
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <Label>Name des Gerichts</Label>
                <Input
                  required
                  value={newDishForm.name}
                  onChange={(e) => setNewDishForm({ ...newDishForm, name: e.target.value })}
                  placeholder="z.B. Pizza Tartufo Speciale"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Kategorie</Label>
                  <select
                    value={newDishForm.categorySlug}
                    onChange={(e) => setNewDishForm({ ...newDishForm, categorySlug: e.target.value })}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-xs"
                  >
                    <option value="le-pizze-classiche">Le Pizze Classiche</option>
                    <option value="pizze-gialle">Le Pizze Gialle</option>
                    <option value="pizze-bianche-calzone">Bianche &amp; Calzone</option>
                    <option value="pasta-fatta-in-casa">Hausgemachte Pasta</option>
                    <option value="antipasti-insalata">Antipasti &amp; Salate</option>
                    <option value="dolci">Dolci Artigianali</option>
                    <option value="getraenke-bier">Getränke &amp; Bier</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <Label>Preis (€)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    required
                    value={newDishForm.price}
                    onChange={(e) => setNewDishForm({ ...newDishForm, price: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Zutaten (Deutsch)</Label>
                <Input
                  required
                  value={newDishForm.ingredients}
                  onChange={(e) => setNewDishForm({ ...newDishForm, ingredients: e.target.value })}
                  placeholder="San Marzano Tomatensauce, Fior di Latte, ..."
                />
              </div>

              <div className="space-y-1">
                <Label>Bildpfad oder URL</Label>
                <Input
                  value={newDishForm.imageSrc}
                  onChange={(e) => setNewDishForm({ ...newDishForm, imageSrc: e.target.value })}
                  placeholder="/images/pizza-margherita.jpg"
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-10 mt-2 cursor-pointer">
                Gericht in Speisekarte veröffentlichen
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: GERICHT BEARBEITEN                                     */}
      {/* ============================================================ */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white dark:bg-[#18120E] border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-poppins font-bold text-lg text-stone-900 dark:text-white">
                Gericht bearbeiten: {editingItem.name}
              </h3>
              <button type="button" onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMenuItem(editingItem.id, {
                  name: editingItem.name,
                  price: Number(editingItem.price),
                  ingredients: editingItem.ingredients,
                });
                setEditingItem(null);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <Label>Name</Label>
                <Input
                  required
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label>Preis (€)</Label>
                <Input
                  type="number"
                  step="0.1"
                  required
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-1">
                <Label>Zutaten</Label>
                <Input
                  required
                  value={editingItem.ingredients}
                  onChange={(e) => setEditingItem({ ...editingItem, ingredients: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-10 mt-2 cursor-pointer">
                Änderungen speichern
              </Button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const map: Record<OrderStatus, { label: string; color: string }> = {
    new: { label: 'Neu', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20 animate-pulse' },
    preparing: { label: 'In Zubereitung', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    ready: { label: 'Abholbereit', color: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    completed: { label: 'Abgeschlossen', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    cancelled: { label: 'Storniert', color: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20' },
  };

  const item = map[status] || map.new;

  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${item.color}`}>
      {item.label}
    </span>
  );
}
