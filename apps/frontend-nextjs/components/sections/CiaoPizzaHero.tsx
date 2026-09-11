'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { useCartStore } from '@/lib/cart';
import { useI18n } from '@/lib/i18n';
import { useMenuBookStore } from '@/lib/menuBookStore';
import { Check, ShoppingBag, ArrowRight, Flame, Sparkles, BookOpen } from 'lucide-react';

interface HeroPizzaOption {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  taglineDe: string;
  taglineEn: string;
  ingredientsDe: string;
  ingredientsEn: string;
  price: number;
  isAlcoholic: boolean;
  allergens: string[];
  imageSrc: string;
  badgeDe: string;
  badgeEn: string;
  badgeColor: string;
}

const HERO_PIZZAS: HeroPizzaOption[] = [
  {
    id: 2,
    slug: 'regina-margherita',
    name: 'Regina Margherita D.O.P.',
    categorySlug: 'le-pizze-classiche',
    taglineDe: 'Die Königin von Neapel',
    taglineEn: 'The Queen of Naples',
    ingredientsDe: 'San Marzano D.O.P. Tomatensauce, Fior di Latte aus Sorrento, frisches Basilikum & natives Olivenöl extra.',
    ingredientsEn: 'San Marzano D.O.P. tomato sauce, Fior di Latte from Sorrento, fresh basil & extra virgin olive oil.',
    price: 9.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
    badgeDe: 'San Marzano D.O.P.',
    badgeEn: 'San Marzano D.O.P.',
    badgeColor: 'bg-napoli-red text-white',
  },
  {
    id: 15,
    slug: 'yellow-bufala',
    name: 'Yellow Bufala',
    categorySlug: 'pizze-gialle',
    taglineDe: 'Sonnige Pizze Gialle',
    taglineEn: 'Sunny Yellow Tomato Pizza',
    ingredientsDe: 'Süße gelbe Datteltomatensauce aus Kampanien, echter Büffelmozzarella D.O.P., Datteltomaten & Basilikumpesto.',
    ingredientsEn: 'Sweet yellow date tomato sauce from Campania, genuine Buffalo Mozzarella D.O.P., date tomatoes & basil pesto.',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-gialla.jpg',
    badgeDe: 'Datterino Giallo',
    badgeEn: 'Yellow Datterino',
    badgeColor: 'bg-napoli-yellow text-napoli-char',
  },
  {
    id: 5,
    slug: 'diabola-2-0',
    name: 'Diavola 2.0 Piccante',
    categorySlug: 'le-pizze-classiche',
    taglineDe: 'Pikant & Vollmundig',
    taglineEn: 'Spicy & Full-Flavored',
    ingredientsDe: 'San Marzano Tomatensauce, Fior di Latte, scharfe neapolitanische Salami & samtige Jalapeño-Creme.',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, spicy Neapolitan salami & velvety jalapeño cream.',
    price: 14.30,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
    badgeDe: 'Salami Piccante',
    badgeEn: 'Spicy Salami',
    badgeColor: 'bg-orange-600 text-white',
  },
  {
    id: 20,
    slug: '4-formaggi',
    name: '4 Formaggi & Tartufo',
    categorySlug: 'pizze-bianche-calzone',
    taglineDe: 'Gourmet Käsetraum',
    taglineEn: 'Gourmet Cheese Dream',
    ingredientsDe: 'Fior di Latte aus Sorrento, Gorgonzola Dolce D.O.P., feiner Ricotta, Grana Padano 24 Monate D.O.P. & Pfeffer.',
    ingredientsEn: 'Fior di Latte from Sorrento, Gorgonzola Dolce D.O.P., delicate ricotta, 24-month Grana Padano D.O.P. & black pepper.',
    price: 14.60,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-formaggi.jpg',
    badgeDe: 'Quattro Formaggi',
    badgeEn: 'Quattro Formaggi',
    badgeColor: 'bg-stone-800 text-white',
  },
];

// Carousel Timing Settings: 2.5 seconds per cycle for a relaxed, premium showcase
const CAROUSEL_INTERVAL_MS = 2500;
const TRANSITION_DURATION_MS = 650;

export function CiaoPizzaHero() {
  const { locale, t } = useI18n();
  const openMenuBook = useMenuBookStore((state) => state.open);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [animKey, setAnimKey] = useState<number>(0);
  const [added, setAdded] = useState<boolean>(false);

  const [isPaused, setIsPaused] = useState<boolean>(false);

  // 3D Interactive Mouse Tilt
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement | null>(null);

  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const selectedIndexRef = useRef<number>(0);
  selectedIndexRef.current = selectedIndex;

  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const addItem = useCartStore((state) => state.addItem);
  const activePizza = HERO_PIZZAS[selectedIndex];
  const exitingPizza = exitingIndex !== null ? HERO_PIZZAS[exitingIndex] : null;

  // Preload all pizza images to eliminate blank flashes during transitions
  useEffect(() => {
    HERO_PIZZAS.forEach((pizza) => {
      if (typeof window !== 'undefined') {
        const img = new window.Image();
        img.src = pizza.imageSrc;
      }
    });
  }, []);

  // Diagonal flow transition trigger
  const triggerTransition = useCallback((targetIndex: number) => {
    if (targetIndex === selectedIndexRef.current) return;

    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }

    const prevIndex = selectedIndexRef.current;
    setExitingIndex(prevIndex);
    setSelectedIndex(targetIndex);
    setIsTransitioning(true);
    setAnimKey((k) => k + 1);

    transitionTimerRef.current = setTimeout(() => {
      setExitingIndex(null);
      setIsTransitioning(false);
    }, TRANSITION_DURATION_MS);
  }, []);

  // Schedule next automatic carousel change (every 1.5s, stops if hovered/paused)
  const scheduleNextAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearTimeout(autoPlayTimerRef.current);
      autoPlayTimerRef.current = null;
    }

    if (isPausedRef.current) return;

    autoPlayTimerRef.current = setTimeout(() => {
      if (!isPausedRef.current) {
        const nextIndex = (selectedIndexRef.current + 1) % HERO_PIZZAS.length;
        triggerTransition(nextIndex);
        scheduleNextAutoPlay();
      }
    }, CAROUSEL_INTERVAL_MS);
  }, [triggerTransition]);

  // Start auto-play on mount and manage pause/resume
  useEffect(() => {
    if (!isPaused) {
      scheduleNextAutoPlay();
    } else {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
        autoPlayTimerRef.current = null;
      }
    }
    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [isPaused, scheduleNextAutoPlay]);

  // Handle user clicking thumbnail
  const handleSelectPizza = (newIndex: number) => {
    if (newIndex === selectedIndex) return;

    triggerTransition(newIndex);
    scheduleNextAutoPlay();
  };

  // Interactive 3D Perspective Tilt on Mouse Movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Mild, luxurious 3D tilt
    setTilt({
      x: -(y / (rect.height / 2)) * 10,
      y: (x / (rect.width / 2)) * 10,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleAddToCart = () => {
    addItem({
      id: activePizza.id,
      slug: activePizza.slug,
      name: activePizza.name,
      unitPrice: activePizza.price,
      isAlcoholic: activePizza.isAlcoholic,
      categorySlug: activePizza.categorySlug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'de-AT', { style: 'currency', currency: 'EUR' }).format(amount);

  const activeBadge = locale === 'en' ? activePizza.badgeEn : activePizza.badgeDe;
  const activeIngredients = locale === 'en' ? activePizza.ingredientsEn : activePizza.ingredientsDe;

  return (
    <section className="relative overflow-hidden bg-[#FBF0DF] dark:bg-[#110D0A] pt-8 pb-16 md:py-20 min-h-[660px] lg:min-h-[760px] flex items-center select-none transition-colors duration-300">
      {/* Curved Warm Background Backdrop Shapes */}
      <div className="absolute right-0 top-0 bottom-0 w-[55%] pointer-events-none hidden md:block overflow-hidden">
        {/* Large Terracotta Red Organic Curved Slice (Stable Background) */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[720px] h-[720px] rounded-full bg-[#C8232C] dark:bg-[#8A151C] opacity-90 dark:opacity-75 transition-all duration-700 ease-out" />
        {/* Golden Warm Amber Secondary Arc */}
        <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[860px] h-[860px] rounded-full bg-[#F4A900]/30 dark:bg-[#F4A900]/15 -z-10" />
      </div>

      {/* 3D Floating Fresh Basil Leaf Decoration (Upper Center/Left) */}
      <div className="absolute top-12 left-[44%] w-16 h-16 md:w-20 md:h-20 pointer-events-none z-20 animate-float-basil hidden sm:block">
        <div className="relative w-full h-full rounded-full overflow-hidden mix-blend-multiply dark:mix-blend-normal opacity-90 drop-shadow-[0_15px_20px_rgba(0,0,0,0.25)]">
          <Image
            src="/images/basil-leaf.jpg"
            alt="Frisches Basilikumblatt"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* 3D Floating Fresh Tomato Slice Decoration (Top Right - fully visible & clear of cards) */}
      <div className="absolute top-6 right-3 sm:top-10 sm:right-8 md:top-12 md:right-14 lg:top-16 lg:right-20 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 pointer-events-none z-20 animate-float-tomato">
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl mix-blend-multiply dark:mix-blend-normal opacity-95">
          <Image
            src="/images/tomato-slice.jpg"
            alt="Frische Tomatenscheibe"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="container px-4 md:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* 1. Brand Title, Story & Pizza Selector (Order 1 on mobile, Top-Left on Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:col-span-6 space-y-4 sm:space-y-6 max-w-xl"
          >
            {/* Playful Brand Badge & Official Emblem */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                {/* Official Logo Badge and Ciao Greeting */}
                <div className="flex items-center gap-2.5">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-500/40 shadow-md bg-black shrink-0">
                    <Image
                      src="/images/logo.jpg"
                      alt="Little Napoli Logo"
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <span className="inline-block font-playfair italic text-napoli-char dark:text-amber-300 text-lg sm:text-xl font-bold tracking-wide">
                    {t('hero.greeting')}
                  </span>
                  {/* Italian Tricolore Bar */}
                  <div className="flex items-center h-2 w-8 rounded-sm overflow-hidden shadow-xs">
                    <span className="h-full w-1/3 bg-[#008C45]" />
                    <span className="h-full w-1/3 bg-[#FFFFFF]" />
                    <span className="h-full w-1/3 bg-[#CD212A]" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openMenuBook(1)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
                    title="Speisekarte als interaktives Buch öffnen"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-napoli-red" />
                    <span>Speisekarte 2026 📖</span>
                  </button>
                </div>
              </div>

              <div>
                <h1 className="font-playfair italic text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#C8232C] dark:text-[#E83C45] tracking-tight leading-[1.05] drop-shadow-sm">
                  Little Napoli
                </h1>
                <p className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-sans font-bold text-stone-500 dark:text-stone-300 mt-1">
                  L&apos;Autentica Pizza Napoletana • Himberg bei Wien
                </p>
              </div>

              {/* Authentic Heritage Badges from littlenapoli.at */}
              <div className="flex items-center gap-2 flex-wrap pt-0.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-napoli-red/10 text-napoli-red dark:text-red-400 border border-napoli-red/20 text-[11px] font-bold">
                  <Flame className="w-3 h-3 text-napoli-red" />
                  Bis zu 96h Teigruhe
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-bold">
                  Amalfiküste D.O.P.
                </span>
                <a
                  href="https://www.instagram.com/little_napoli_pizzeria/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/10 hover:bg-pink-500/20 text-pink-700 dark:text-pink-400 border border-pink-500/20 text-[11px] font-bold transition-colors"
                >
                  <Sparkles className="w-3 h-3 text-pink-500" />
                  @little_napoli_pizzeria
                </a>
              </div>
            </div>

            {/* Narrative description */}
            <p className="text-[#3A2B20] dark:text-stone-300 text-sm sm:text-base md:text-lg font-medium leading-relaxed">
              {locale === 'en'
                ? 'Handcrafted according to ancient Neapolitan tradition with up to 96 hours of dough maturation, baked at 485°C with certified D.O.P. ingredients from southern Italy and flour from the Amalfi Coast.'
                : 'Traditionell zubereitet nach neapolitanischer Handwerkskunst mit bis zu 96 Stunden Teigruhe, gebacken bei 485°C mit original D.O.P. Zutaten aus Süditalien und feinstem Mehl von der Amalfiküste.'}
            </p>

            {/* Interactive Pizza Selector Thumbnails Row */}
            <div className="pt-1 sm:pt-2">
              <div className="flex items-center gap-3 sm:gap-4">
                {HERO_PIZZAS.map((pizza, idx) => (
                  <button
                    key={pizza.id}
                    type="button"
                    onClick={() => handleSelectPizza(idx)}
                    className={`relative group rounded-full p-1 transition-all duration-300 cursor-pointer ${
                      selectedIndex === idx
                        ? 'scale-110 shadow-xl ring-2 ring-napoli-green ring-offset-2 ring-offset-[#FBF0DF] dark:ring-offset-[#110D0A]'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    aria-label={`Wähle ${pizza.name}`}
                  >
                    <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/90 dark:border-stone-700 shadow-md bg-white dark:bg-stone-800">
                      <Image
                        src={pizza.imageSrc}
                        alt={pizza.name}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 2. 3D Perspective Interactive Pizza Showcase Stage (Order 2 on mobile -> ON TOP OF CARD! Desktop: Right Column spanning both rows) */}
          <motion.div
            ref={stageRef}
            initial={{ opacity: 0, x: 45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => {
              handleMouseLeave();
              setIsPaused(false);
            }}
            className="order-2 lg:order-2 lg:col-span-6 lg:row-span-2 flex items-center justify-center relative py-4 sm:py-6 [perspective:1400px]"
          >
            <div
              className="hero-carousel-stage relative w-[290px] sm:w-[420px] md:w-[480px] lg:w-[540px] aspect-square transition-transform duration-300 ease-out [transform-style:preserve-3d]"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              
              {/* 3D Realistic Turntable Base Drop Shadow */}
              <div className="absolute inset-4 rounded-full bg-black/25 dark:bg-black/60 blur-3xl -z-10 transform translate-y-10 pointer-events-none" />

              {/* 1. Stable White Ceramic Base Plate (Fixed Porcelain Centerpiece) */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[#FCFAF7] to-[#EAE4DC] dark:from-[#2A231E] dark:via-[#201A16] dark:to-[#171310] shadow-[0_25px_60px_-15px_rgba(40,15,5,0.25),0_10px_25px_-5px_rgba(0,0,0,0.1)] border-[6px] sm:border-8 border-white/95 dark:border-stone-700 ring-1 ring-stone-200/80 dark:ring-stone-800 pointer-events-none z-0">
                {/* Porcelain inner rim depth */}
                <div className="absolute inset-3 sm:inset-4 md:inset-5 rounded-full border border-stone-200/70 dark:border-stone-800 shadow-[inset_0_4px_14px_rgba(0,0,0,0.06)]" />
              </div>

              {/* 2. Rapid High-Elevation Diagonal Pizza Flow: Enters from HIGH UP Top-Right, Exits to Bottom-Right */}
              <div className="absolute inset-0 z-10 [transform:translateZ(25px)]">
                {/* Exiting Pizza: Plunges from Center (0,0) down toward Bottom-Right (+X, +Y) and fades out */}
                {exitingPizza && (
                  <div
                    key={`exit-${exitingPizza.id}-${animKey}`}
                    className="pizza-exit-diagonal absolute inset-0 rounded-full overflow-hidden pointer-events-none"
                    style={{
                      filter: 'drop-shadow(0 25px 40px rgba(80, 25, 5, 0.4))',
                    }}
                  >
                    <Image
                      src={exitingPizza.imageSrc}
                      alt={exitingPizza.name}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 768px) 340px, (max-width: 1200px) 480px, 540px"
                    />
                  </div>
                )}

                {/* Incoming Pizza: Enters with HIGH ELEVATION from way up Top-Right (+X, -Y) into Center (0,0) */}
                <div
                  key={`active-${activePizza.id}-${animKey}`}
                  className={`absolute inset-0 rounded-full overflow-hidden ${
                    isTransitioning ? 'pizza-enter-diagonal pointer-events-none' : 'shadow-2xl'
                  }`}
                  style={{
                    filter: 'drop-shadow(0 30px 45px rgba(80, 25, 5, 0.4))',
                  }}
                >
                  <Image
                    src={activePizza.imageSrc}
                    alt={activePizza.name}
                    fill
                    priority
                    className="object-contain"
                    sizes="(max-width: 768px) 340px, (max-width: 1200px) 480px, 540px"
                  />
                </div>
              </div>

              {/* 3. 3D Oven Badge Overlay with Depth */}
              <div className="absolute -top-2 right-4 bg-white/95 dark:bg-[#1F1915]/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-xl border border-stone-200/80 dark:border-stone-800 flex items-center gap-2 pointer-events-none z-30 [transform:translateZ(45px)]">
                <Flame className="w-4 h-4 text-napoli-red animate-pulse" />
                <div className="text-left">
                  <span className="block text-[11px] font-bold text-napoli-char dark:text-white leading-none">{t('hero.ovenBadge')}</span>
                  <span className="text-[9px] text-stone-500 dark:text-stone-400 font-medium">{t('hero.doughBadge')}</span>
                </div>
              </div>

            </div>
          </motion.div>

          {/* 3. Active Pizza Detail Card (Order 3 on mobile -> AT BOTTOM OF PIZZA! Desktop: Bottom-Left) */}
          <motion.div
            initial={{ opacity: 0, x: -45 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="order-3 lg:order-3 lg:col-span-6 max-w-xl"
          >
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="bg-white/90 dark:bg-[#1A1411]/90 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-amber-900/10 dark:border-stone-800 shadow-lg space-y-3 transition-all duration-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full transition-colors duration-300 ${activePizza.badgeColor}`}>
                    {activeBadge}
                  </span>
                  <Link href={`/menu/${activePizza.slug}`}>
                    <h2 className="font-poppins text-xl sm:text-2xl font-bold text-napoli-char dark:text-white mt-1 hover:text-napoli-red dark:hover:text-red-400 transition-colors cursor-pointer">
                      {activePizza.name}
                    </h2>
                  </Link>
                </div>
                <div className="text-right">
                  <span className="font-poppins text-2xl font-extrabold text-[#C8232C] dark:text-[#F84B55]">
                    {formatEuro(activePizza.price)}
                  </span>
                  <span className="block text-[10px] text-stone-500 dark:text-stone-400 font-mono">{t('hero.taxNotice')}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-[#4E3D30] dark:text-stone-300 leading-relaxed min-h-[40px]">
                {activeIngredients}
              </p>

              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400">{t('hero.allergens')}</span>
                {activePizza.allergens.map((c) => (
                  <AllergenBadge key={c} code={c} />
                ))}
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <Button
                  size="default"
                  onClick={handleAddToCart}
                  className="bg-napoli-red hover:bg-napoli-redDark text-white font-bold gap-2 shadow-md hover:scale-105 active:scale-95 transition-all text-sm px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      {t('hero.addedToCart')}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      {t('hero.addToCart')} ({formatEuro(activePizza.price)})
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => openMenuBook(1)}
                  className="border-amber-600/30 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100/90 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-bold gap-1.5 text-sm rounded-xl cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-all"
                >
                  <BookOpen className="w-4 h-4 text-napoli-red animate-pulse" />
                  <span>Speisekarte 📖</span>
                </Button>

                <Link href={`/menu/${activePizza.slug}`}>
                  <Button
                    variant="outline"
                    className="border-amber-900/20 dark:border-stone-700 bg-white/80 dark:bg-stone-900/80 hover:bg-white dark:hover:bg-stone-800 text-napoli-char dark:text-stone-200 font-semibold gap-1.5 text-sm rounded-xl cursor-pointer"
                  >
                    {t('hero.viewDetails')}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scoped CSS for the 1.5s High-Elevation Diagonal Cascade (NO Rotation) */}
      <style jsx>{`
        .hero-carousel-stage {
          /* Much higher elevation travel height */
          --travel-x: clamp(110px, 18vw, 200px);
          --travel-y: clamp(260px, 38vw, 420px);
        }

        /* Diagonal Exit: Fast plunge to Bottom-Right */
        .pizza-exit-diagonal {
          animation: pizzaSlideExit 650ms cubic-bezier(0.25, 0.9, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        /* Diagonal Enter: High-altitude swoop from Top-Right down to Center */
        .pizza-enter-diagonal {
          animation: pizzaSlideEnter 650ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }

        @keyframes pizzaSlideExit {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--travel-x), var(--travel-y), 0) scale(0.9);
            opacity: 0;
          }
        }

        @keyframes pizzaSlideEnter {
          0% {
            transform: translate3d(var(--travel-x), calc(-1 * var(--travel-y)), 0) scale(0.9);
            opacity: 0.2;
          }
          25% {
            opacity: 0.9;
          }
          100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .pizza-exit-diagonal {
            animation: pizzaReducedFadeExit 400ms ease-out forwards !important;
          }
          .pizza-enter-diagonal {
            animation: pizzaReducedFadeEnter 400ms ease-out forwards !important;
          }
        }

        @keyframes pizzaReducedFadeExit {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes pizzaReducedFadeEnter {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
