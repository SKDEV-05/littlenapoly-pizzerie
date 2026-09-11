'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useMenuBookStore } from '@/lib/menuBookStore';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Compass,
  Car,
  Train,
  CalendarDays,
  BookOpen,
  ExternalLink,
} from 'lucide-react';

export function FooterLocationMap() {
  const pathname = usePathname();
  const openMenuBook = useMenuBookStore((state) => state.open);

  // Hide on Admin Dashboard
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=Hauptstra%C3%9Fe+44,+2325+Himberg';
  const appleMapsUrl = 'https://maps.apple.com/?daddr=Hauptstra%C3%9Fe+44,+2325+Himberg';

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-[#FAF7F2] via-stone-100 to-[#F2EAE0] dark:from-[#0E0A08] dark:via-[#140F0C] dark:to-[#18120F] border-t border-stone-200 dark:border-stone-800 transition-colors duration-300 overflow-hidden">
      <div className="container px-4 md:px-8 max-w-7xl mx-auto space-y-12">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-block text-xs uppercase tracking-widest text-napoli-red dark:text-red-400 font-bold px-3.5 py-1 rounded-full bg-napoli-red/10 dark:bg-red-950/40 border border-napoli-red/20">
            Standort &amp; Anfahrt
          </span>
          <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
            Besuchen Sie uns in Himberg bei Wien
          </h2>
          <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
            Genießen Sie echte neapolitanische Holzofenpizza und hausgemachte Pasta in unserer gemütlichen Pizzeria.
          </p>
        </div>

        {/* 2-Column Responsive Layout with Framer Motion scroll animations (Left vs Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* ============================================================ */}
          {/* LEFT COLUMN: Animated Entrance from LEFT                     */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-white dark:bg-[#1A1411] p-6 sm:p-8 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl flex flex-col justify-between space-y-6"
          >
            <div className="space-y-6">
              
              {/* Restaurant Header & Live Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    'Live: Geöffnet bis 22:00 Uhr
                  </span>
                </div>

                <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-white">
                  Little Napoli
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
                  Pizzeria &amp; Feinkost • Traditionelle Pizza Napoletana
                </p>
              </div>

              {/* Address Card */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-napoli-red/10 text-napoli-red flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-napoli-red" />
                  </div>
                  <div>
                    <span className="block font-poppins font-bold text-sm text-stone-900 dark:text-white">
                      Hauptstraße 44
                    </span>
                    <span className="block text-xs text-stone-600 dark:text-stone-300 font-medium">
                      2325 Himberg bei Wien, Niederösterreich
                    </span>
                    <span className="text-[11px] text-stone-400 block mt-1">
                      (Direkt an der Schwechat &amp; nahe HOFER Himberg)
                    </span>
                  </div>
                </div>
              </div>

              {/* Travel & Parking Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/60 dark:border-stone-800/80 flex items-start gap-2.5">
                  <Car className="w-4 h-4 text-napoli-yellow shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">Kostenlose Parkplätze</span>
                    <span className="text-stone-500 text-[11px]">Direkt vor dem Haus &amp; beim nahen HOFER</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/60 dark:border-stone-800/80 flex items-start gap-2.5">
                  <Train className="w-4 h-4 text-napoli-green shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-900 dark:text-stone-100 block">S-Bahn S60</span>
                    <span className="text-stone-500 text-[11px]">Nur 5 Gehminuten von Bahnhof Himberg</span>
                  </div>
                </div>
              </div>

              {/* Opening Hours Summary */}
              <div className="space-y-1.5 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800">
                  <span className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                    <Clock className="w-3.5 h-3.5 text-napoli-red" />
                    Dienstag – Sonntag:
                  </span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">11:00 – 22:00 Uhr</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="font-medium text-stone-500">Montag:</span>
                  <span className="font-mono text-stone-400">Ruhetag (Ofen geschlossen)</span>
                </div>
              </div>

            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-stone-100 dark:border-stone-800">
              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-napoli-red hover:bg-napoli-redDark text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 text-center"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs shadow-md transition-all hover:scale-105 active:scale-95 text-center"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  <span>Apple Maps</span>
                </a>
              </div>

              {/* Digital Book Button Trigger */}
              <button
                type="button"
                onClick={() => openMenuBook(1)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-[#221B16] hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-napoli-red" />
                <span>Speisekarte 2026 als Buch durchblättern 📖</span>
              </button>
            </div>
          </motion.div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: Animated Entrance from RIGHT (Interactive Map) */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-7 bg-white dark:bg-[#1A1411] rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-xl overflow-hidden relative min-h-[420px] lg:min-h-[500px] flex flex-col"
          >
            {/* Top Info Strip on Map */}
            <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-[#1A1411]/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-stone-200/80 dark:border-stone-700 flex items-center gap-3 pointer-events-auto">
              <div className="w-8 h-8 rounded-xl bg-napoli-red flex items-center justify-center text-white shadow-sm">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="text-left">
                <span className="block font-poppins font-extrabold text-xs text-stone-900 dark:text-white leading-tight">
                  Little Napoli Pizzeria &amp; Feinkost
                </span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400">
                  Hauptstraße 44, 2325 Himberg
                </span>
              </div>
            </div>

            {/* Apple Maps Compass Replica (from user screenshot) in bottom-right */}
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex items-center justify-center w-11 h-11 rounded-full bg-white/95 dark:bg-[#1A1411]/95 backdrop-blur-md border border-stone-200 dark:border-stone-700 shadow-lg">
              <div className="flex flex-col items-center">
                <span className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[5px] border-b-napoli-red" />
                <span className="text-[10px] font-mono font-black text-stone-900 dark:text-white leading-none mt-0.5">N</span>
              </div>
            </div>

            {/* Live Interactive Map Iframe */}
            <iframe
              title="Karte Little Napoli Hauptstraße 44 Himberg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2664.062828351785!2d16.4425113!3d48.0772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476da5f38dcdd9ff%3A0x89e0b82f8087cf2c!2sHauptstra%C3%9Fe%2044%2C%202325%20Himberg!5e0!3m2!1sde!2sat!4v1710000000000!5m2!1sde!2sat"
              className="w-full flex-1 border-0 min-h-[420px] lg:min-h-full"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

        </div>

      </div>
    </section>
  );
}
