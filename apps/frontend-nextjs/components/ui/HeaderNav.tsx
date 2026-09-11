'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/lib/cart';
import { useFavoritesStore } from '@/lib/favorites';
import { useAuthStore } from '@/lib/authStore';
import { AuthModal } from '@/components/auth/AuthModal';
import { useTheme } from '@/lib/theme';
import { useMenuBookStore } from '@/lib/menuBookStore';
import {
  Phone,
  ShoppingBag,
  Flame,
  UtensilsCrossed,
  CalendarDays,
  Globe,
  Sun,
  Moon,
  MapPin,
  Sparkles,
  Menu as MenuIcon,
  X,
  BookOpen,
  Instagram,
  Home,
  ChevronRight,
  Heart,
  User as UserIcon,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

export function HeaderNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalCount());
  const financials = useCartStore((state) => state.getFinancials());
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const currentUser = useAuthStore((state) => state.currentUser);
  const openAuthModal = useAuthStore((state) => state.openAuthModal);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();
  const openMenuBook = useMenuBookStore((state) => state.open);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Hide the public header on Admin pages so there is ONLY ONE admin navbar!
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const formatEuro = (val: number) =>
    new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(val);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* 1. European High-End Gastronomy Micro-Bar */}
      <div className="w-full bg-[#18120F] dark:bg-[#0E0A08] text-[#E8DCCB] text-[11px] py-1.5 px-3 sm:px-4 md:px-8 border-b border-amber-900/20 font-mono flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-6 shrink-0">
          {/* Real-time Status */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white tracking-wide text-[10.5px] sm:text-[11px]">
              LIVE: Geöffnet bis 22:00
            </span>
          </div>

          {/* Oven Temperature Badge (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-1 text-amber-400">
            <Flame className="w-3.5 h-3.5 text-napoli-red fill-napoli-red animate-pulse" />
            <span>485°C Holzofen • 96h Teigruhe</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6 shrink-0 text-stone-300">
          {/* Location */}
          <div className="hidden lg:flex items-center gap-1 hover:text-white transition-colors">
            <MapPin className="w-3 h-3 text-napoli-red" />
            <span>Hauptstraße 44, 2325 Himberg bei Wien</span>
          </div>

          {/* Instagram Direct */}
          <a
            href="https://www.instagram.com/little_napoli_pizzeria/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-stone-300 hover:text-pink-400 transition-colors group"
            title="Folge uns auf Instagram"
          >
            <Instagram className="w-3.5 h-3.5 text-pink-400 group-hover:scale-110 transition-transform" />
            <span className="hidden md:inline font-mono">@little_napoli_pizzeria</span>
          </a>

          {/* Direct Phone */}
          <a
            href="tel:+43223542733"
            className="flex items-center gap-1 text-napoli-yellow hover:text-white transition-colors font-bold text-[10.5px] sm:text-[11px]"
          >
            <Phone className="w-3 h-3 text-napoli-yellow" />
            <span>+43 2235 42733</span>
          </a>
        </div>
      </div>

      {/* 2. Main Glassmorphic Navbar */}
      <div className="w-full bg-white/90 dark:bg-[#15110E]/95 backdrop-blur-xl border-b border-stone-200/80 dark:border-stone-800/80 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_25px_rgba(0,0,0,0.4)] transition-colors duration-300">
        <div className="w-full max-w-7xl mx-auto flex h-16 sm:h-20 items-center justify-between px-3 sm:px-4 md:px-8">
          
          {/* Brand Logo & Playfair Script Typography */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0" aria-label="Little Napoli Homepage">
            {/* Circular Official Logo Badge */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full overflow-hidden border border-white/25 shadow-md bg-black transition-transform duration-300 group-hover:scale-105 shrink-0 ring-1 ring-amber-500/20">
              <Image
                src="/images/logo.jpg"
                alt="Little Napoli"
                fill
                sizes="48px"
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col justify-center min-w-0">
              <span className="font-playfair italic text-lg sm:text-2xl md:text-3xl font-bold tracking-tight text-napoli-char dark:text-white leading-none group-hover:text-napoli-red transition-colors truncate">
                Little Napoli
              </span>
              <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1">
                <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.22em] text-stone-500 dark:text-stone-300 font-sans font-bold whitespace-nowrap">
                  L&apos;Autentica Pizza Napoletana
                </span>
                {/* Italian Flag Colors */}
                <div className="flex items-center h-1.5 w-4 sm:w-6 rounded-xs overflow-hidden shrink-0 ml-0.5 shadow-xs">
                  <span className="h-full w-1/3 bg-[#008C45]" />
                  <span className="h-full w-1/3 bg-[#FFFFFF]" />
                  <span className="h-full w-1/3 bg-[#CD212A]" />
                </div>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 font-medium text-sm">
            <Link
              href="/menu"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 hover:bg-stone-100 dark:hover:bg-stone-900/60 transition-all font-semibold"
            >
              <UtensilsCrossed className="w-4 h-4 text-napoli-red" />
              <span>Speisekarte</span>
            </Link>

            {/* Favorites Link */}
            <Link
              href="/menu?category=favorites"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 text-xs font-bold shadow-xs transition-all cursor-pointer group"
              title="Meine Favoriten"
            >
              <Heart className="w-3.5 h-3.5 text-napoli-red fill-napoli-red/20 group-hover:scale-110 transition-transform" />
              <span>Favoriten</span>
              {isMounted && favoriteIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-napoli-red text-white text-[10px] font-mono font-bold">
                  {favoriteIds.length}
                </span>
              )}
            </Link>

            {/* Interactive Menu Book Button */}
            <button
              type="button"
              onClick={() => openMenuBook(1)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200/90 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-napoli-red dark:hover:text-red-400 text-xs font-bold shadow-sm transition-all cursor-pointer group"
              title="Offizielle Speisekarte als digitales Buch durchblättern"
            >
              <BookOpen className="w-3.5 h-3.5 text-napoli-red group-hover:scale-110 transition-transform" />
              <span>Speisekarte 📖</span>
            </button>

            <Link
              href="/#menu-section"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-stone-500 dark:text-stone-400 hover:text-napoli-char dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-900/40 transition-all text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-napoli-yellow" />
              <span>96h Teig-Rezeptur</span>
            </Link>
          </nav>

          {/* Action Center: Theme + Booking + Cart + Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Theme Toggle (Desktop) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="hidden md:inline-flex p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:scale-105 active:scale-95 shadow-sm transition-all cursor-pointer"
              aria-label="Design umschalten"
              title="Design umschalten"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-napoli-yellow" />
              ) : (
                <Moon className="w-4 h-4 text-stone-700" />
              )}
            </button>

            {/* Admin Dashboard Quick Link (Visible when logged in as admin) */}
            {isMounted && currentUser?.role === 'admin' && (
              <Link href="/admin">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold gap-1 text-xs px-2.5 sm:px-3 py-1.5 rounded-xl shadow-md cursor-pointer"
                  title="Zum Admin Dashboard"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Button>
              </Link>
            )}

            {/* User Account / Sign In (Desktop) */}
            {isMounted && (
              currentUser ? (
                <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs font-semibold">
                  <UserIcon className="w-3.5 h-3.5 text-napoli-red" />
                  <span className="truncate max-w-[80px]">{currentUser.name.split(' ')[0]}</span>
                  <button
                    type="button"
                    onClick={logout}
                    title="Abmelden"
                    className="text-stone-400 hover:text-red-500 cursor-pointer ml-0.5 p-0.5"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal('signin')}
                  className="hidden md:inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border-stone-300 dark:border-stone-700 cursor-pointer"
                >
                  <UserIcon className="w-3.5 h-3.5 text-napoli-red" />
                  <span>Anmelden</span>
                </Button>
              )
            )}

            {/* Table Reservation Button (Desktop) */}
            <Link href="/reservation" className="hidden sm:inline-flex">
              <Button
                size="sm"
                className="bg-napoli-red hover:bg-napoli-redDark text-white font-bold gap-1.5 text-xs px-3.5 py-2 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Tisch</span>
              </Button>
            </Link>

            {/* Cart Button */}
            <Link href="/order">
              <Button
                variant="napoli"
                size="sm"
                className="relative bg-stone-900 dark:bg-napoli-red text-white font-bold text-xs h-9 px-3 rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-napoli-yellow text-napoli-char text-[10px] font-black flex items-center justify-center animate-bounce shadow-sm">
                    {totalItems}
                  </span>
                )}
                <span className="hidden md:inline font-mono ml-1.5">
                  {totalItems > 0 ? formatEuro(financials.subtotal) : 'Warenkorb'}
                </span>
              </Button>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden h-9 w-9 p-0 flex items-center justify-center rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer transition-colors"
              aria-label="Menü öffnen"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

          </div>

        </div>
      </div>

      {/* 3. Luxury Off-Canvas Drawer (Slides from RIGHT to LEFT like girlsbeauty.totalh.net) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Drawer Content Container: Right to Left Slide */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="absolute top-0 right-0 bottom-0 w-[85vw] max-w-[340px] bg-white dark:bg-[#140F0C] border-l border-stone-200/80 dark:border-stone-800/80 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              {/* Drawer Top Header: Logo + Close Button */}
              <div>
                <div className="p-5 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/30 bg-black shadow-sm shrink-0">
                      <Image
                        src="/images/logo.jpg"
                        alt="Little Napoli"
                        fill
                        sizes="36px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-playfair italic text-xl font-bold text-stone-900 dark:text-white leading-none block">
                        Little Napoli
                      </span>
                      <span className="text-[9px] uppercase tracking-widest text-stone-400 dark:text-stone-500 font-sans block mt-0.5">
                        Pizzeria &amp; Feinkost
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 transition-colors cursor-pointer"
                    aria-label="Menü schließen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Vertical Navigation Links */}
                <div className="p-4 space-y-2">

                  {/* Admin Dashboard Quick Access (If Admin) */}
                  {isMounted && currentUser?.role === 'admin' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-between p-3 rounded-xl bg-red-600 text-white font-bold shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" />
                        <span>🛡️ Admin Dashboard</span>
                      </div>
                      <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">Verwaltung</span>
                    </Link>
                  )}

                  {/* User Profile or Sign-In Trigger */}
                  {isMounted && (
                    currentUser ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-napoli-red text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-stone-900 dark:text-white truncate">
                              {currentUser.name}
                            </div>
                            <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate font-mono">
                              {currentUser.email}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="text-xs text-red-600 hover:text-red-700 font-bold px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer shrink-0"
                        >
                          Abmelden
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          openAuthModal('signin');
                        }}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold text-xs shadow-md cursor-pointer"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>Anmelden / Registrieren</span>
                      </button>
                    )
                  )}

                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 text-napoli-red" />
                      <span>Startseite</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>

                  <Link
                    href="/menu"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <UtensilsCrossed className="w-4 h-4 text-napoli-red" />
                      <span>Speisekarte</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </Link>

                  {/* Favorites Link with Live Counter */}
                  <Link
                    href="/menu?category=favorites"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="w-4 h-4 text-napoli-red fill-napoli-red/20" />
                      <span>Meine Favoriten</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-napoli-red bg-napoli-red/10 px-2.5 py-0.5 rounded-full">
                      {isMounted ? favoriteIds.length : 0}
                    </span>
                  </Link>

                  {/* Interactive Flipbook Speisekarte Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openMenuBook(1);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 text-stone-900 dark:text-stone-100 border border-amber-500/25 font-bold hover:bg-amber-500/15 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-napoli-red" />
                      <span>Speisekarte als Buch</span>
                    </div>
                    <span className="text-[10px] bg-napoli-yellow text-napoli-char px-2 py-0.5 rounded-md font-mono font-bold">2026 📖</span>
                  </button>

                  {/* Table Reservation Action */}
                  <Link
                    href="/reservation"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-napoli-red hover:bg-napoli-redDark text-white font-bold shadow-md transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-4 h-4" />
                      <span>Tisch Reservieren</span>
                    </div>
                    <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-md font-mono">Online</span>
                  </Link>

                  {/* Cart Link */}
                  <Link
                    href="/order"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 text-napoli-red" />
                      <span>Warenkorb</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-napoli-red bg-napoli-red/10 px-2.5 py-0.5 rounded-full">
                      {totalItems > 0 ? formatEuro(financials.subtotal) : '0'}
                    </span>
                  </Link>

                  {/* Direct Phone Call */}
                  <a
                    href="tel:+43223542733"
                    className="flex items-center justify-between p-3 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-900 font-mono font-bold transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-napoli-red" />
                      <span>+43 2235 42733</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">Anrufen</span>
                  </a>

                  {/* Instagram Direct Link */}
                  <a
                    href="https://www.instagram.com/little_napoli_pizzeria/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-purple-950/20 via-pink-950/15 to-orange-950/20 border border-pink-500/25 text-stone-800 dark:text-stone-200 hover:text-pink-400 font-medium transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Instagram className="w-4 h-4 text-pink-500" />
                      <span className="text-xs">@little_napoli_pizzeria</span>
                    </div>
                    <span className="text-[10px] bg-pink-500/15 text-pink-500 px-2 py-0.5 rounded-md font-mono">Folgen</span>
                  </a>
                </div>
              </div>

              {/* Drawer Bottom Footer: Theme Switcher & Info */}
              <div className="p-4 border-t border-stone-100 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 space-y-3">
                {/* Appearance Theme Switch */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-stone-600" />}
                    <span>Erscheinungsbild</span>
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-bold shadow-xs cursor-pointer"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
                    <span>{theme === 'dark' ? 'Hell' : 'Dunkel'}</span>
                  </button>
                </div>

                {/* Location Micro Note */}
                <div className="pt-2 text-center text-[10px] text-stone-400 font-mono">
                  Hauptstraße 44, 2325 Himberg bei Wien
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Auth Modal */}
      <AuthModal />
    </header>
  );
}
