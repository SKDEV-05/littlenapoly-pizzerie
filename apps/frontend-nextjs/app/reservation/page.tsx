'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { submitReservation } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import {
  CalendarDays,
  Clock,
  Users,
  Phone,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Flame,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

export default function ReservationPage() {
  const { locale, t } = useI18n();

  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '+43',
    party_size: 2,
    reserved_date: new Date().toISOString().split('T')[0],
    time_slot: '18:30',
    special_requests: '',
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await submitReservation(formData);
      setSuccessData(result);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (locale === 'en'
            ? 'Reservation could not be completed. Please call us directly.'
            : 'Die Reservierung konnte nicht durchgeführt werden. Bitte rufen Sie uns direkt an.')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] py-10 md:py-16 transition-colors duration-300">
      <div className="container px-4 md:px-8 max-w-2xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:text-napoli-red dark:hover:text-red-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Back to Home' : 'Zur Startseite'}</span>
          </Link>
        </div>

        {/* Page Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-napoli-red/30 dark:border-red-900/50 bg-white/80 dark:bg-[#1A1411]/80 text-napoli-red dark:text-red-400 text-xs font-bold shadow-sm">
            <Flame className="w-3.5 h-3.5 animate-pulse" />
            <span>{t('res.badge')}</span>
          </div>

          <h1 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            {t('res.title')}
          </h1>

          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
            {t('res.subtitle')}
          </p>

          {/* Quick Highlight Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300">
              <Clock className="w-3 h-3 text-napoli-red" />
              11:00 – 22:00
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300">
              <Sparkles className="w-3 h-3 text-napoli-yellow" />
              {locale === 'en' ? 'Instant Confirmation' : 'Sofortige Bestätigung'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 text-[11px] font-medium text-stone-700 dark:text-stone-300">
              <ShieldCheck className="w-3 h-3 text-napoli-green" />
              {locale === 'en' ? 'Free Cancellation' : 'Kostenlos stornierbar'}
            </span>
          </div>
        </div>

        {/* Form or Confirmation Card */}
        {successData ? (
          <Card className="border border-napoli-green/40 shadow-2xl bg-white dark:bg-[#1A1411] text-center p-8 sm:p-10 space-y-6 rounded-3xl transition-colors">
            <div className="w-18 h-18 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-napoli-green flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="font-poppins text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                {t('res.successTitle')}
              </h2>
              <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
                {locale === 'en'
                  ? `Thank you, ${successData.guest_name}. We have successfully reserved your table for ${successData.party_size} guests.`
                  : `Vielen Dank, ${successData.guest_name}. Wir haben Ihren Tisch für ${successData.party_size} Personen verbindlich reserviert.`}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-[#120D0A] border border-stone-200 dark:border-stone-800 p-5 rounded-2xl text-left space-y-3 font-mono text-xs max-w-md mx-auto shadow-inner">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200 dark:border-stone-800">
                <span className="text-stone-500 dark:text-stone-400">{t('res.code')}</span>
                <span className="font-bold text-base text-napoli-red dark:text-red-400">
                  {successData.reservation_code}
                </span>
              </div>
              <div className="flex justify-between text-stone-700 dark:text-stone-300">
                <span className="text-stone-500 dark:text-stone-400">{t('res.dateLabel')}</span>
                <span className="font-bold">{successData.reserved_date}</span>
              </div>
              <div className="flex justify-between text-stone-700 dark:text-stone-300">
                <span className="text-stone-500 dark:text-stone-400">{t('res.timeLabel')}</span>
                <span className="font-bold">{successData.time_slot} Uhr</span>
              </div>
              {successData.table_number && (
                <div className="flex justify-between text-stone-700 dark:text-stone-300">
                  <span className="text-stone-500 dark:text-stone-400">{t('res.tableLabel')}</span>
                  <span className="font-bold">Tisch {successData.table_number}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSuccessData(null);
                  setFormData((prev) => ({ ...prev, special_requests: '' }));
                }}
                className="border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl cursor-pointer"
              >
                {t('res.another')}
              </Button>
              <Link href="/">
                <Button className="bg-napoli-red hover:bg-napoli-redDark text-white rounded-xl shadow-md cursor-pointer">
                  {locale === 'en' ? 'Back to Home' : 'Zur Startseite'}
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="shadow-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-[#1A1411] rounded-3xl overflow-hidden transition-colors">
            <CardHeader className="pb-4 pt-6 sm:pt-8 px-6 sm:px-8 border-b border-stone-100 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/20">
              <CardTitle className="text-2xl font-bold font-poppins text-stone-900 dark:text-white">
                {t('res.formTitle')}
              </CardTitle>
              <CardDescription className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm">
                {t('res.formDesc')}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMessage && (
                  <div className="flex items-center gap-2.5 p-3.5 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 rounded-xl">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="guest_name" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.name')}
                    </Label>
                    <div className="relative">
                      <User className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="guest_name"
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        placeholder={t('res.namePlaceholder')}
                        value={formData.guest_name}
                        onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guest_email" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.email')}
                    </Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="guest_email"
                        type="email"
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        placeholder={t('res.emailPlaceholder')}
                        value={formData.guest_email}
                        onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & Party Size */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="guest_phone" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.phone')}
                    </Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="guest_phone"
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 font-mono rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        placeholder={t('res.phonePlaceholder')}
                        value={formData.guest_phone}
                        onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="party_size" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.partySize')}
                    </Label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="party_size"
                        type="number"
                        min={1}
                        max={20}
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        value={formData.party_size}
                        onChange={(e) => setFormData({ ...formData, party_size: parseInt(e.target.value) || 1 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="reserved_date" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.date')}
                    </Label>
                    <div className="relative">
                      <CalendarDays className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="reserved_date"
                        type="date"
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        value={formData.reserved_date}
                        onChange={(e) => setFormData({ ...formData, reserved_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time_slot" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                      {t('res.time')}
                    </Label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-napoli-red dark:text-red-400 absolute left-3.5 top-4 pointer-events-none" />
                      <Input
                        id="time_slot"
                        type="time"
                        required
                        className="pl-10 h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                        value={formData.time_slot}
                        onChange={(e) => setFormData({ ...formData, time_slot: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <Label htmlFor="special_requests" className="text-xs uppercase tracking-wider font-semibold text-stone-700 dark:text-stone-300">
                    {t('res.specialRequests')}
                  </Label>
                  <Input
                    id="special_requests"
                    className="h-12 bg-stone-50 dark:bg-[#120D0A] border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl text-sm focus:ring-2 focus:ring-napoli-red focus:border-napoli-red"
                    placeholder={t('res.specialRequestsPlaceholder')}
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                  />
                </div>

                {/* Submit Action Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-13 text-base font-bold bg-gradient-to-r from-napoli-red to-napoli-redDark hover:from-napoli-redDark hover:to-[#7A1117] text-white shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all rounded-xl cursor-pointer"
                >
                  {loading ? t('res.submitting') : t('res.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
