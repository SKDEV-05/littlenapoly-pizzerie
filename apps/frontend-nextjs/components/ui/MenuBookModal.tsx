'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useMenuBookStore } from '@/lib/menuBookStore';
import { useI18n } from '@/lib/i18n';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Maximize2,
  Minimize2,
  Sparkles,
  Flame,
  Award,
} from 'lucide-react';

const MENU_DOWNLOAD_URL = 'https://littlenapoli.at/wp-content/uploads/2026/01/little-napoli-2026-web.pdf';

interface BookPage {
  pageNumber: number;
  titleDe: string;
  titleEn: string;
  categorySlug?: string;
  type: 'cover' | 'story' | 'dishes' | 'drinks';
  badge?: string;
  items?: {
    name: string;
    ingredients: string;
    price: string;
    allergens?: string;
  }[];
}

const BOOK_PAGES: BookPage[] = [
  // Page 1: Cover
  {
    pageNumber: 1,
    titleDe: 'Speisekarte 2026',
    titleEn: 'Menu 2026',
    type: 'cover',
    badge: 'Edizione 2026',
  },
  // Page 2: The Tradition & Dough Story
  {
    pageNumber: 2,
    titleDe: 'Das Geheimnis der Pizza Napoletana',
    titleEn: 'The Secret of Pizza Napoletana',
    type: 'story',
    badge: 'Tradizione',
  },
  // Page 3: Le Pizze Classiche
  {
    pageNumber: 3,
    titleDe: 'Le Pizze Classiche',
    titleEn: 'Classic Pizzas',
    categorySlug: 'le-pizze-classiche',
    type: 'dishes',
    badge: 'San Marzano D.O.P.',
    items: [
      { name: '1. Marinara', ingredients: 'San Marzano Tomatensauce, Oregano, Knoblauch, Basilikum', price: '€ 8,50', allergens: 'A' },
      { name: '2. Regina Margherita', ingredients: 'San Marzano Tomaten, Sorrento Fior di Latte, Basilikum', price: '€ 9,90', allergens: 'A, G' },
      { name: '3. Cotto', ingredients: 'San Marzano Tomaten, Fior di Latte, feiner Prosciutto Cotto', price: '€ 13,90', allergens: 'A, G' },
      { name: '4. Salame', ingredients: 'San Marzano Tomaten, Fior di Latte, Neapolitanische Salami', price: '€ 13,90', allergens: 'A, G' },
      { name: '5. Diabola 2.0 Piccante', ingredients: 'San Marzano, Fior di Latte, scharfe Salami, Jalapeño-Creme', price: '€ 14,30', allergens: 'A, G' },
      { name: '6. Bufala Campana D.O.P.', ingredients: 'San Marzano Tomaten, echter Büffelmozzarella aus Neapel', price: '€ 13,90', allergens: 'A, G' },
      { name: '7. Vegetariana', ingredients: 'San Marzano Tomaten, Fior di Latte, frisches Grillgemüse', price: '€ 14,60', allergens: 'A, G' },
      { name: '8. San Daniele D.O.P.', ingredients: 'San Marzano, Fior di Latte, 24M San Daniele Schinken, Grana', price: '€ 16,90', allergens: 'A, G' },
    ],
  },
  // Page 4: Pizze Gialle & Bianche
  {
    pageNumber: 4,
    titleDe: 'Pizze Gialle & Bianche Gourmet',
    titleEn: 'Yellow & Gourmet White Pizzas',
    categorySlug: 'pizze-gialle',
    type: 'dishes',
    badge: 'Datterino Giallo',
    items: [
      { name: '14. Yellow Marinara', ingredients: 'Gelbe Datteltomatensauce, Oregano, Knoblauch, Basilikum', price: '€ 8,50', allergens: 'A' },
      { name: '15. Yellow Bufala', ingredients: 'Gelbe Datteltomaten, Büffelmozzarella D.O.P., Pesto', price: '€ 14,90', allergens: 'A, G' },
      { name: '16. Mediterranea Gialla', ingredients: 'Gelbe Datteltomaten, Thunfisch, rote Zwiebeln, Oliven', price: '€ 14,80', allergens: 'A, D, G' },
      { name: '18. Super Parmigiana', ingredients: 'Gelbe Tomaten, Melanzane alla Parmigiana, Basilikum', price: '€ 15,20', allergens: 'A, G' },
      { name: '20. 4 Formaggi & Tartufo', ingredients: 'Fior di Latte, Gorgonzola Dolce, Ricotta, Trüffelöl', price: '€ 14,60', allergens: 'A, G' },
      { name: '21. Tartufo e Funghi', ingredients: 'Fior di Latte, Steinpilze, Champignons, Trüffelcarpaccio', price: '€ 16,60', allergens: 'A, G' },
      { name: '23. Calzone Classico', ingredients: 'Gefüllte Pizza mit Ricotta, Fior di Latte & Salami', price: '€ 14,80', allergens: 'A, G' },
    ],
  },
  // Page 5: Antipasti & Hausgemachte Pasta
  {
    pageNumber: 5,
    titleDe: 'Antipasti & Hausgemachte Pasta',
    titleEn: 'Antipasti & Fresh Pasta',
    categorySlug: 'pasta-fatta-in-casa',
    type: 'dishes',
    badge: 'Fatto in Casa',
    items: [
      { name: '27. Caprese di Bufala', ingredients: 'Rucola, Kirschtomaten rot/gelb, Büffelmozzarella D.O.P.', price: '€ 13,50', allergens: 'G' },
      { name: '28. Insalata Rucola & Grana', ingredients: 'Rucola, Kirschtomaten, Grana Padano 24M D.O.P.', price: '€ 8,90', allergens: 'G' },
      { name: '31. Spaghetti al Pomodoro', ingredients: 'San Marzano D.O.P. Tomatensauce, frisches Basilikum', price: '€ 9,90', allergens: 'A' },
      { name: '35. Penne all’Arrabbiata', ingredients: 'Feurige Peperoncino-Knoblauch-Tomatensauce, Grana', price: '€ 11,50', allergens: 'A' },
      { name: '36. Gnocchi Sorrento', ingredients: 'Handgemachte Kartoffelgnocchi, Tomatensauce, Mozzarella', price: '€ 12,30', allergens: 'A, G' },
      { name: '39. Lasagne Caserecce (500g)', ingredients: 'Traditionelle Bolognese-Ragú-Lasagne mit Béchamel', price: '€ 13,90', allergens: 'A, C, G, L' },
    ],
  },
  // Page 6: Dolci & Getränke
  {
    pageNumber: 6,
    titleDe: 'Dolci Artigianali & Getränke',
    titleEn: 'Artisanal Desserts & Drinks',
    categorySlug: 'dolci',
    type: 'drinks',
    badge: 'Dolce Vita',
    items: [
      { name: '42. Hausgemachtes Tiramisú', ingredients: 'Originales Rezept mit feinstem Mascarpone (alkoholfrei)', price: '€ 6,50', allergens: 'A, G' },
      { name: '43. Pistazienprofiterol', ingredients: 'Brandteigkugeln gefüllt mit sizilianischer Pistaziencreme', price: '€ 6,50', allergens: 'A, C, G, H' },
      { name: '49. Ichnusa non-filtrata (0,33L)', ingredients: 'Unfiltriertes sardisches Spezial-Kultbier (5,0% Vol.)', price: '€ 4,50', allergens: 'A' },
      { name: '50. Birra Moretti (0,33L)', ingredients: 'Italienisches Premium-Lagerbier vom Fass (4,6% Vol.)', price: '€ 4,50', allergens: 'A' },
      { name: 'San Benedetto Mineral (0,5L)', ingredients: 'Natürliches italienisches Quellwasser still / prickelnd', price: '€ 2,20', allergens: '' },
      { name: 'Chianti Classico D.O.C.G.', ingredients: 'Toskanischer Spitzen-Rotwein, trocken & samtig (0,75L)', price: '€ 28,00', allergens: 'O' },
    ],
  },
];

export function MenuBookModal() {
  const { isOpen, currentPage, close, setPage } = useMenuBookStore();
  const { locale } = useI18n();
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight' && currentPage < BOOK_PAGES.length) {
        setPage(currentPage + 1);
      }
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setPage(currentPage - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentPage, close, setPage]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const activePageData = BOOK_PAGES.find((p) => p.pageNumber === currentPage) || BOOK_PAGES[0];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen) return null;

  // Split dishes cleanly across left and right pages so margins are generous and beautiful
  const leftDishes = activePageData.items ? activePageData.items.slice(0, Math.ceil(activePageData.items.length / 2)) : [];
  const rightDishes = activePageData.items ? activePageData.items.slice(Math.ceil(activePageData.items.length / 2)) : [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl">
        
        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full bg-[#1A1411] text-stone-100 rounded-3xl border border-amber-900/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isFullscreen ? 'h-full max-w-none rounded-none' : 'max-w-5xl h-[92vh] max-h-[880px]'
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#120D0A] border-b border-stone-800/80 shrink-0">
            {/* Left: Brand / Title */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-napoli-red flex items-center justify-center text-white shadow-md">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-poppins text-xs sm:text-sm font-extrabold text-white leading-tight">
                  Little Napoli — Speisekarte 2026
                </span>
                <span className="text-[10px] text-amber-400 font-mono flex items-center gap-1">
                  <Flame className="w-3 h-3 text-napoli-red fill-napoli-red" />
                  485°C Holzofenfrisch • Himberg bei Wien
                </span>
              </div>
            </div>

            {/* Right: Actions (Download, Fullscreen, Close) */}
            <div className="flex items-center gap-2">
              <a
                href={MENU_DOWNLOAD_URL}
                download="little-napoli-speisekarte-2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-800 bg-[#1E1713] hover:bg-[#2A201A] text-stone-300 hover:text-white text-xs font-semibold shadow-sm transition-all"
                title="Offizielle Speisekarte herunterladen"
              >
                <Download className="w-3.5 h-3.5 text-napoli-yellow" />
                <span>Herunterladen</span>
              </a>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="hidden sm:flex p-2 rounded-xl border border-stone-800 bg-[#1E1713] hover:bg-[#2A201A] text-stone-300 hover:text-white transition-all cursor-pointer"
                title={isFullscreen ? 'Vollbild beenden' : 'Vollbild'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={close}
                className="p-2 rounded-xl bg-stone-800/80 hover:bg-napoli-red text-stone-300 hover:text-white transition-all cursor-pointer shadow-md"
                title="Schließen (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Content Stage: Realistic Interactive Book */}
          <div className="flex-1 relative flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-b from-[#16110D] via-[#1A1410] to-[#120D0A]">
            
            {/* Floating Left / Prev Arrow */}
            <button
              type="button"
              onClick={() => setPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-napoli-red disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center backdrop-blur-md border border-stone-700 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Vorherige Seite"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Floating Right / Next Arrow */}
            <button
              type="button"
              onClick={() => setPage(Math.min(BOOK_PAGES.length, currentPage + 1))}
              disabled={currentPage === BOOK_PAGES.length}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/70 hover:bg-napoli-red disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center backdrop-blur-md border border-stone-700 shadow-xl transition-all hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Nächste Seite"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* The Open Book Perspective Container with ample margins */}
            <div className="w-full max-w-5xl min-h-[520px] md:h-[600px] lg:h-[630px] [perspective:1800px] flex items-center justify-center my-auto">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, rotateY: 10, scale: 0.98 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -10, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full rounded-3xl bg-[#FCFAF6] text-stone-900 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8),inset_0_0_90px_rgba(0,0,0,0.06)] border-[6px] sm:border-[10px] md:border-[12px] border-[#2C1E15] ring-1 ring-black/40 flex overflow-hidden relative"
                >
                  
                  {/* ----------------- PAGE TYPE: COVER ----------------- */}
                  {activePageData.type === 'cover' && (
                    <div className="w-full h-full bg-gradient-to-br from-[#8A151C] via-napoli-red to-[#5A0C11] text-white p-6 sm:p-12 md:p-14 flex flex-col justify-between relative overflow-hidden">
                      {/* Decorative Gold Inset Border with Generous Margin */}
                      <div className="absolute inset-4 sm:inset-6 md:inset-8 border-2 border-amber-400/30 rounded-2xl pointer-events-none z-10" />

                      {/* Warm Ember Glow */}
                      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
                      <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-yellow-500/15 blur-3xl pointer-events-none" />

                      {/* Top Tag */}
                      <div className="flex items-center justify-between border-b border-white/20 pb-4 relative z-20 mx-4 sm:mx-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-bold">
                          Pizzeria &amp; Feinkost • Himberg bei Wien
                        </span>
                        <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-sm text-xs font-mono border border-white/20">
                          485°C Holzofen
                        </span>
                      </div>

                      {/* Center Brand Title */}
                      <div className="text-center space-y-4 my-auto relative z-20 px-4">
                        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl">
                          <Flame className="w-10 h-10 text-amber-300 fill-amber-300 animate-pulse" />
                        </div>
                        <h1 className="font-poppins text-4xl sm:text-6xl font-black tracking-tight drop-shadow-md">
                          Little Napoli
                        </h1>
                        <p className="text-sm sm:text-lg text-amber-200 font-serif italic tracking-wide">
                          L&apos;Autentica Pizza Napoletana
                        </p>
                        <div className="inline-block px-5 py-2 rounded-full bg-white text-napoli-char text-xs font-bold shadow-lg">
                          Offizielle Speisekarte 2026
                        </div>
                      </div>

                      {/* Bottom Details */}
                      <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs text-stone-200 font-mono relative z-20 mx-4 sm:mx-6">
                        <span>Hauptstraße 44, 2325 Himberg</span>
                        <span>Tel: +43 2235 42733</span>
                      </div>
                    </div>
                  )}

                  {/* ----------------- PAGE TYPE: STORY (Spacious Two-Page Layout) ----------------- */}
                  {activePageData.type === 'story' && (
                    <div className="w-full h-full flex flex-col md:flex-row relative">
                      {/* Left Page (Verso) with generous margin */}
                      <div className="flex-1 flex flex-col justify-between pl-8 sm:pl-12 md:pl-16 pr-6 sm:pr-8 py-6 sm:py-8 md:py-10 overflow-y-auto">
                        <div className="space-y-3 sm:space-y-4">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-napoli-red px-2.5 py-0.5 rounded-md bg-napoli-red/10 border border-napoli-red/20">
                            Tradition &amp; Handwerk
                          </span>
                          <h2 className="font-poppins text-xl sm:text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">
                            Das Geheimnis wahrer Pizza Napoletana
                          </h2>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-serif">
                            Unser Teig besteht aus nur vier reinen Zutaten: bestem Weizenmehl Typ 00 (Caputo), Wasser, Meersalz und einem Hauch Hefe.
                          </p>
                        </div>

                        <div className="relative aspect-[16/10] sm:aspect-video rounded-2xl overflow-hidden shadow-md border border-stone-200 my-3">
                          <Image
                            src="/images/pizza-margherita.jpg"
                            alt="Pizza Napoletana Holzofen"
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>Caputo 00 Mehl</span>
                          <span>Seite 2</span>
                        </div>
                      </div>

                      {/* Central Spine Seam & Depth Shadow */}
                      <div className="hidden md:block w-px bg-stone-300 relative z-20">
                        <div className="absolute inset-y-0 -left-4 w-8 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none" />
                      </div>

                      {/* Right Page (Recto) with generous margin */}
                      <div className="flex-1 flex flex-col justify-between pl-6 sm:pl-8 pr-8 sm:pr-12 md:pr-16 py-6 sm:py-8 md:py-10 overflow-y-auto">
                        <div className="space-y-3 sm:space-y-3.5 my-auto max-w-sm mx-auto w-full">
                          <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200/90 shadow-sm space-y-1">
                            <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                              48 Stunden Teigruhe
                            </h3>
                            <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                              Lange, kühle Reifung garantiert unübertroffene Bekömmlichkeit und einen herrlich fluffigen Rand (Cornicione).
                            </p>
                          </div>

                          <div className="p-3 sm:p-3.5 rounded-2xl bg-red-50/90 border border-red-200/90 shadow-sm space-y-1">
                            <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                              <Flame className="w-4 h-4 text-napoli-red shrink-0" />
                              485°C Neapolitanischer Ofen
                            </h3>
                            <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                              In 60 bis 90 Sekunden scharf gebacken — für den authentischen Leopard-Look und zarte Kruste.
                            </p>
                          </div>

                          <div className="p-3 sm:p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 shadow-sm space-y-1">
                            <h3 className="font-bold text-xs sm:text-sm text-stone-900 flex items-center gap-2">
                              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                              100% D.O.P. Zutaten
                            </h3>
                            <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed">
                              San Marzano Tomaten vom Vesuv, Fior di Latte aus Sorrento und Büffelmozzarella aus Neapel.
                            </p>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-stone-200/80 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>Tradizione Napoletana</span>
                          <span>Little Napoli</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ----------------- PAGE TYPE: DISHES & DRINKS (Two-Page Balanced Spread) ----------------- */}
                  {(activePageData.type === 'dishes' || activePageData.type === 'drinks') && (
                    <div className="w-full h-full flex flex-col md:flex-row relative">
                      {/* Left Page (Verso) - Dishes 1 to 4 */}
                      <div className="flex-1 flex flex-col justify-between pl-8 sm:pl-12 md:pl-16 pr-6 sm:pr-8 py-6 sm:py-8 md:py-10 overflow-y-auto">
                        {/* Header */}
                        <div className="border-b border-stone-200/90 pb-2.5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-napoli-red block">
                            {activePageData.badge}
                          </span>
                          <h2 className="font-poppins text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
                            {locale === 'en' ? activePageData.titleEn : activePageData.titleDe}
                          </h2>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 py-3 flex-1">
                          {leftDishes.map((dish, idx) => (
                            <div key={idx} className="border-b border-stone-100 pb-2 flex flex-col justify-between">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-poppins text-xs sm:text-sm font-bold text-stone-900">
                                  {dish.name}
                                </span>
                                <span className="font-poppins text-xs sm:text-sm font-extrabold text-napoli-red whitespace-nowrap">
                                  {dish.price}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                                {dish.ingredients}
                              </p>
                              {dish.allergens && (
                                <span className="text-[9px] text-stone-400 font-mono">
                                  Allergene: {dish.allergens}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-stone-200/90 pt-2.5 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>Alle Preise inkl. österr. USt</span>
                          <span>Seite {activePageData.pageNumber}</span>
                        </div>
                      </div>

                      {/* Central Spine Seam & Depth Shadow */}
                      <div className="hidden md:block w-px bg-stone-300 relative z-20">
                        <div className="absolute inset-y-0 -left-4 w-8 bg-gradient-to-r from-black/15 via-black/5 to-black/15 pointer-events-none" />
                      </div>

                      {/* Right Page (Recto) - Dishes 5 to 8 */}
                      <div className="flex-1 flex flex-col justify-between pl-6 sm:pl-8 pr-8 sm:pr-12 md:pr-16 py-6 sm:py-8 md:py-10 overflow-y-auto">
                        {/* Header */}
                        <div className="border-b border-stone-200/90 pb-2.5 flex items-center justify-between">
                          <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">
                            Traditionelle Spezialitäten
                          </span>
                          <span className="text-[10px] font-mono text-amber-700 font-bold">
                            485°C Holzofen
                          </span>
                        </div>

                        {/* Items */}
                        <div className="space-y-3 py-3 flex-1">
                          {rightDishes.map((dish, idx) => (
                            <div key={idx} className="border-b border-stone-100 pb-2 flex flex-col justify-between">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="font-poppins text-xs sm:text-sm font-bold text-stone-900">
                                  {dish.name}
                                </span>
                                <span className="font-poppins text-xs sm:text-sm font-extrabold text-napoli-red whitespace-nowrap">
                                  {dish.price}
                                </span>
                              </div>
                              <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                                {dish.ingredients}
                              </p>
                              {dish.allergens && (
                                <span className="text-[9px] text-stone-400 font-mono">
                                  Allergene: {dish.allergens}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-stone-200/90 pt-2.5 flex items-center justify-between text-[10px] text-stone-400 font-mono">
                          <span>Little Napoli • Himberg</span>
                          <span>Frisch serviert</span>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* Bottom Filmstrip / Book Page Reel */}
          <div className="px-4 py-3 bg-[#120D0A] border-t border-stone-800 shrink-0">
            <div className="flex items-center justify-between max-w-4xl mx-auto gap-4">
              
              <span className="text-xs text-stone-400 font-mono hidden sm:inline whitespace-nowrap">
                Seite {currentPage} von {BOOK_PAGES.length}
              </span>

              {/* Scrollable Page Reel Thumbnails */}
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
                {BOOK_PAGES.map((page) => {
                  const isActive = currentPage === page.pageNumber;

                  return (
                    <button
                      key={page.pageNumber}
                      type="button"
                      onClick={() => setPage(page.pageNumber)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                        isActive
                          ? 'bg-napoli-red text-white shadow-md scale-105'
                          : 'bg-[#1E1713] text-stone-400 hover:text-white hover:bg-[#2A201A]'
                      }`}
                    >
                      <span className="font-mono">{page.pageNumber}.</span>
                      <span className="truncate max-w-[110px] sm:max-w-[150px]">
                        {locale === 'en' ? page.titleEn : page.titleDe}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile Page indicator */}
              <span className="text-xs text-stone-400 font-mono sm:hidden">
                {currentPage}/{BOOK_PAGES.length}
              </span>

            </div>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
