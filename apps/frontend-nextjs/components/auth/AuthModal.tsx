'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/authStore';
import { useI18n } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Heart,
} from 'lucide-react';

export function AuthModal() {
  const { locale, t } = useI18n();
  const {
    isAuthModalOpen,
    authModalTab,
    authRedirectCallback,
    authPromptMessage,
    closeAuthModal,
    openAuthModal,
    login,
    register,
    loginAsAdminDemo,
    loginAsCustomerDemo,
  } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+43 ');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || 'Login fehlgeschlagen');
      } else if (authRedirectCallback && typeof window !== 'undefined') {
        window.location.href = authRedirectCallback;
      }
    } catch {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register(name, email, phone, password);
      if (!res.success) {
        setError(res.error || 'Registrierung fehlgeschlagen');
      } else if (authRedirectCallback && typeof window !== 'undefined') {
        window.location.href = authRedirectCallback;
      }
    } catch {
      setError('Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdmin = async () => {
    setLoading(true);
    await loginAsAdminDemo();
    setLoading(false);
    if (authRedirectCallback && typeof window !== 'undefined') {
      window.location.href = authRedirectCallback;
    }
  };

  const handleQuickCustomer = async () => {
    setLoading(true);
    await loginAsCustomerDemo();
    setLoading(false);
    if (authRedirectCallback && typeof window !== 'undefined') {
      window.location.href = authRedirectCallback;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark Blur Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={closeAuthModal}
        className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
      />

      {/* Modal Dialog Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md bg-white dark:bg-[#18120E] border border-stone-200 dark:border-stone-800 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-napoli-red/10 dark:bg-red-950/40 text-napoli-red dark:text-red-400 mb-1 border border-napoli-red/20 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="font-playfair italic text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
            Little Napoli
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            {authModalTab === 'signin'
              ? 'Melden Sie sich an für Bestellungen, Favoriten & Tischreservierungen.'
              : 'Erstellen Sie ein Konto für schnellere Bestellungen und exklusive Vorteile.'}
          </p>
        </div>

        {/* Special Auth Prompt (e.g. Liking dishes / Favorites) */}
        {authPromptMessage && (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-semibold shadow-xs">
            <Heart className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0 fill-red-600" />
            <span>{authPromptMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-stone-100 dark:bg-stone-900 p-1 border border-stone-200 dark:border-stone-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setError(null);
              openAuthModal('signin', authRedirectCallback);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              authModalTab === 'signin'
                ? 'bg-white dark:bg-[#221B16] text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Anmelden
          </button>
          <button
            type="button"
            onClick={() => {
              setError(null);
              openAuthModal('signup', authRedirectCallback);
            }}
            className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
              authModalTab === 'signup'
                ? 'bg-white dark:bg-[#221B16] text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            Registrieren
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Container */}
        {authModalTab === 'signin' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                E-Mail-Adresse
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@littlenapoli.at"
                  className="pl-10 h-11 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10 h-11 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-napoli-red hover:bg-napoli-redDark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? 'Wird angemeldet...' : 'Jetzt anmelden'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Vollständiger Name
              </Label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="z.B. Lisa Maria"
                  className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                E-Mail-Adresse
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.at"
                  className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Telefonnummer (Österreich)
              </Label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+43 676 1234567"
                  className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Passwort
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mindestens 6 Zeichen"
                  className="pl-10 h-10 bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-xs sm:text-sm rounded-xl"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-napoli-red hover:bg-napoli-redDark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer mt-1"
            >
              {loading ? 'Konto wird erstellt...' : 'Konto kostenlos erstellen'}
            </Button>
          </form>
        )}

        {/* Fast 1-Click Demo Login Helper */}
        <div className="pt-3 border-t border-stone-200/80 dark:border-stone-800/80 space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500 block text-center">
            Schnellzugang für Demo &amp; Testen
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickAdmin}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/70 dark:bg-red-950/30 text-napoli-red dark:text-red-300 hover:bg-red-100 transition-colors text-[11px] font-bold cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Login</span>
            </button>
            <button
              type="button"
              onClick={handleQuickCustomer}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 transition-colors text-[11px] font-bold cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Kunden Login</span>
            </button>
          </div>
          <div className="text-[10px] text-stone-400 text-center font-mono">
            Admin: admin@littlenapoli.at • Pass: admin123
          </div>
        </div>
      </motion.div>
    </div>
  );
}
