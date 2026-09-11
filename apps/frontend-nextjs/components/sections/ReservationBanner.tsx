'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, Phone, BookOpen, Clock } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useMenuBookStore } from '@/lib/menuBookStore';

export function ReservationBanner() {
  const { t } = useI18n();
  const openMenuBook = useMenuBookStore((state) => state.open);

  return (
    <section className="py-16 md:py-20 bg-gradient-to-r from-[#981b22] via-napoli-red to-[#701015] text-white overflow-hidden relative">
      {/* Background radial glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-8 max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Element: Glide from LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-4 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-bold text-amber-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Di – So: 11:00 – 22:00 Uhr • Himberg bei Wien</span>
            </div>

            <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {t('cta.reservationTitle')}
            </h2>

            <p className="text-white/90 text-sm sm:text-base leading-relaxed max-w-2xl">
              {t('cta.reservationDesc')}
            </p>
          </motion.div>

          {/* Right Element: Glide from RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3.5 justify-center"
          >
            <Link href="/reservation" className="w-full">
              <Button
                size="lg"
                className="w-full bg-white text-napoli-char hover:bg-stone-100 gap-2 font-bold shadow-xl text-sm sm:text-base py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <CalendarDays className="w-5 h-5 text-napoli-red" />
                <span>{t('cta.bookOnline')}</span>
              </Button>
            </Link>

            <a href="tel:+43223542733" className="w-full">
              <Button
                size="lg"
                className="w-full bg-napoli-yellow text-napoli-char hover:bg-yellow-400 gap-2 font-mono font-bold shadow-xl text-sm sm:text-base py-3.5 rounded-2xl border border-yellow-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Phone className="w-5 h-5 text-napoli-char" />
                <span>+43 2235 42733</span>
              </Button>
            </a>

            <Button
              size="lg"
              type="button"
              onClick={() => openMenuBook(1)}
              className="w-full bg-black/40 hover:bg-black/60 text-white border border-white/30 backdrop-blur-sm gap-2 font-bold shadow-lg text-sm sm:text-base py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-amber-300" />
              <span>Speisekarte (Buch) 📖</span>
            </Button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
