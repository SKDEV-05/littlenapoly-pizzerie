'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { CANONICAL_MENU_DATA, MenuItemData } from '@/components/sections/MenuGrid';
import { useCartStore } from '@/lib/cart';
import { useFavoritesStore } from '@/lib/favorites';
import { useI18n } from '@/lib/i18n';
import { useMenuBookStore } from '@/lib/menuBookStore';
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Check,
  Flame,
  Sparkles,
  Heart,
  BookOpen,
  Star,
} from 'lucide-react';

export interface CategoryCardData {
  slug: string;
  titleDe: string;
  titleEn: string;
  subtitleDe: string;
  subtitleEn: string;
  badgeDe: string;
  badgeEn: string;
  imageSrc: string;
  itemCount: number;
}

export const CATEGORIES_SHOWCASE_DATA: CategoryCardData[] = [
  {
    slug: 'le-pizze-classiche',
    titleDe: 'Le Pizze Classiche',
    titleEn: 'Classic Neapolitan Pizzas',
    subtitleDe: 'San Marzano D.O.P., Sorrento Fior di Latte & 485°C Holzofen',
    subtitleEn: 'San Marzano D.O.P. tomatoes, Sorrento Fior di Latte & wood-fired heat',
    badgeDe: 'Bestseller D.O.P.',
    badgeEn: 'Bestseller D.O.P.',
    imageSrc: '/images/pizza-margherita.jpg',
    itemCount: 13,
  },
  {
    slug: 'pizze-gialle',
    titleDe: 'Le Pizze Gialle',
    titleEn: 'Sunny Yellow Tomato Pizzas',
    subtitleDe: 'Sonnige gelbe Datteltomaten aus Kampanien & feiner Büffelmozzarella',
    subtitleEn: 'Sweet yellow date tomato sauce from Campania & buffalo mozzarella',
    badgeDe: 'Spezialität',
    badgeEn: 'Specialty',
    imageSrc: '/images/pizza-gialla.jpg',
    itemCount: 6,
  },
  {
    slug: 'pizze-bianche-calzone',
    titleDe: 'Bianche & Calzone',
    titleEn: 'White Pizzas & Calzones',
    subtitleDe: 'Gefüllte Calzoni, Gourmet 4 Formaggi & aromatischer Trüffelkäse',
    subtitleEn: 'Stuffed calzones, gourmet 4 cheeses & delicate Italian truffle',
    badgeDe: 'Gourmet',
    badgeEn: 'Gourmet',
    imageSrc: '/images/pizza-formaggi.jpg',
    itemCount: 4,
  },
  {
    slug: 'antipasti-insalata',
    titleDe: 'Antipasti & Salate',
    titleEn: 'Antipasti & Fresh Salads',
    subtitleDe: 'Burrata Pugliese, Bruschetta Classica & knackige italienische Salate',
    subtitleEn: 'Creamy Burrata Pugliese, classic bruschetta & crisp Italian salads',
    badgeDe: 'Frisch & Knackig',
    badgeEn: 'Fresh & Crisp',
    imageSrc: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=800&q=80',
    itemCount: 7,
  },
  {
    slug: 'pasta-fatta-in-casa',
    titleDe: 'Hausgemachte Pasta',
    titleEn: 'Handcrafted Fresh Pasta',
    subtitleDe: 'Täglich frisch gerollte Pasta, Lasagne Caserecce & feine Saucen',
    subtitleEn: 'Daily handcrafted pasta, traditional lasagne & slow-simmered sauces',
    badgeDe: 'Hausgemacht',
    badgeEn: 'Handmade Daily',
    imageSrc: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=800&q=80',
    itemCount: 9,
  },
  {
    slug: 'dolci',
    titleDe: 'Dolci Artigianali',
    titleEn: 'Artisanal Italian Desserts',
    subtitleDe: 'Hausgemachtes Tiramisú, Soufflé al Cioccolato & Pistazienprofiteroles',
    subtitleEn: 'Homemade authentic Tiramisú, chocolate soufflé & pistachio profiteroles',
    badgeDe: 'Dolce Vita',
    badgeEn: 'Dolce Vita',
    imageSrc: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    itemCount: 4,
  },
  {
    slug: 'getraenke-bier',
    titleDe: 'Getränke & Wein',
    titleEn: 'Italian Drinks & Craft Beers',
    subtitleDe: 'Unfiltriertes Ichnusa Bier, Bio-Limonaden & italienische Qualitätsweine',
    subtitleEn: 'Unfiltered Sardinian craft beer, organic spritzers & regional wines',
    badgeDe: 'Erfrischend',
    badgeEn: 'Refreshing',
    imageSrc: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80',
    itemCount: 8,
  },
];

// Top 8 Curated Bestsellers for the Homepage
const TOP_BESTSELLER_SLUGS = [
  'regina-margherita',
  'yellow-bufala',
  'diabola-2-0',
  '4-formaggi',
  'caprese-di-bufala',
  'lasagne-caserecce',
  'hausgemachtes-tiramisu',
  'ichnusa-non-filtrata',
];

export function CategoriesShowcase() {
  const { locale, t } = useI18n();
  const openMenuBook = useMenuBookStore((state) => state.open);
  const addItem = useCartStore((state) => state.addItem);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const topProducts = TOP_BESTSELLER_SLUGS.map((slug) =>
    CANONICAL_MENU_DATA.find((item) => item.slug === slug)
  ).filter(Boolean) as MenuItemData[];

  const handleAddToCart = (item: MenuItemData) => {
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      unitPrice: item.price,
      isAlcoholic: item.isAlcoholic,
      categorySlug: item.categorySlug,
    });
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1400);
  };

  return (
    <section className="py-16 md:py-24 bg-[#FAF7F2] dark:bg-[#0E0A08] transition-colors duration-300 overflow-hidden">
      <div className="container px-4 md:px-8 space-y-16">
        
        {/* ============================================================ */}
        {/* 1. LUXURY CATEGORY SHOWCASE (Inspired by Girls Beauty style)   */}
        {/* ============================================================ */}
        <div className="space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="text-center max-w-2xl mx-auto space-y-3"
          >
            <span className="inline-block text-xs uppercase tracking-widest text-napoli-red dark:text-red-400 font-bold px-3 py-1 rounded-full bg-napoli-red/10 dark:bg-red-950/40 border border-napoli-red/20">
              {locale === 'en' ? 'Culinary Heritage of Naples' : 'Traditionelle Handwerkskunst'}
            </span>
            <h2 className="font-playfair italic text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {locale === 'en' ? 'Explore Our Categories' : 'Kategorien entdecken'}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              {locale === 'en'
                ? 'From classic 48h dough wood-fired pizzas to sunny yellow tomatoes and handmade pasta — discover our authentic specialties.'
                : 'Von klassischer 48h Holzofenpizza über sonnige Pizze Gialle bis hin zu handgemachter Pasta und feinen Dolci — wählen Sie Ihre Lieblingskategorie.'}
            </p>
          </motion.div>

          {/* Cards Grid (3 columns on desktop, 2 on tablet, 1 on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {CATEGORIES_SHOWCASE_DATA.map((cat, idx) => {
              const title = locale === 'en' ? cat.titleEn : cat.titleDe;
              const subtitle = locale === 'en' ? cat.subtitleEn : cat.subtitleDe;
              const badge = locale === 'en' ? cat.badgeEn : cat.badgeDe;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, x: isEven ? -35 : 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.65, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/menu?category=${cat.slug}`}
                    className="group relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] shadow-md hover:shadow-2xl transition-all duration-500 flex flex-col justify-between p-6 sm:p-7 select-none border border-stone-200/60 dark:border-stone-800 block h-full"
                  >
                    {/* Background Image with Smooth Hover Zoom */}
                    <Image
                      src={cat.imageSrc}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* High-End Dark Gradient Overlay for optimal legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/15 group-hover:from-black/95 group-hover:via-black/55 transition-colors duration-500" />

                    {/* Top Row: Floating Category Badge & Item Count */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="bg-white/95 dark:bg-[#1A1411]/95 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-stone-900 dark:text-stone-100 shadow-md">
                        {badge}
                      </span>
                      <span className="text-white/80 font-mono text-xs font-semibold bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                        {cat.itemCount} {locale === 'en' ? 'Dishes' : 'Gerichte'}
                      </span>
                    </div>

                    {/* Bottom Content: Title, Description & Animated Link */}
                    <div className="relative z-10 space-y-2">
                      <h3 className="font-poppins text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
                        {title}
                      </h3>
                      <p className="text-stone-200 text-xs sm:text-sm line-clamp-2 leading-relaxed font-medium">
                        {subtitle}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
                        <span>{locale === 'en' ? 'Explore Collection' : 'Spezialitäten entdecken'}</span>
                        <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. TOP 8 BESTSELLERS SHOWCASE (Directly below Categories Grid) */}
        {/* ============================================================ */}
        <div className="pt-8 space-y-8 border-t border-stone-200/80 dark:border-stone-800/80">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            {/* Left Header Element: Glide from LEFT */}
            <motion.div
              initial={{ opacity: 0, x: -45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-napoli-red" />
                <span className="text-xs font-bold uppercase tracking-wider text-napoli-red dark:text-red-400">
                  {locale === 'en' ? 'Our Guests’ Favorites' : 'Top Bestseller & Empfehlungen'}
                </span>
              </div>
              <h3 className="font-playfair italic text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-900 dark:text-white tracking-tight">
                {locale === 'en' ? 'Most Loved Specialties' : 'Unsere beliebtesten Gerichte'}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm max-w-xl">
                {locale === 'en'
                  ? 'Handpicked favorites from our 51 menu items — freshly prepared with certified Italian ingredients.'
                  : 'Ausgewählte Highlights aus unseren 51 Spezialitäten — frisch gebacken und serviert.'}
              </p>
            </motion.div>

            {/* Right Action Elements: Glide from RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 45 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="flex items-center gap-2.5 flex-wrap"
            >
              <Button
                type="button"
                variant="outline"
                onClick={() => openMenuBook(1)}
                className="border-amber-600/30 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-950 dark:text-amber-200 font-bold gap-2 text-xs rounded-xl shadow-sm cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-napoli-red" />
                <span>Speisekarte 📖</span>
              </Button>

              <Link href="/menu">
                <Button
                  variant="outline"
                  className="border-stone-300 dark:border-stone-700 hover:border-napoli-red text-stone-800 dark:text-stone-200 font-bold gap-2 text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  <span>{locale === 'en' ? 'View All 51 Dishes' : 'Alle 51 Gerichte im Menü'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Product Cards Grid: Exactly 2 cards in a row on mobile, 2 on tablet, 4 on desktop (Picture 2 style) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {topProducts.map((item) => {
              const isAdded = addedItemId === item.id;
              const isFav = isMounted && favoriteIds.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="group bg-white dark:bg-[#18120E] rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800/90 shadow-xs hover:shadow-xl hover:border-napoli-red/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Dish Image with Badges & Wishlist Heart Button */}
                  <div className="relative w-full aspect-square sm:aspect-[4/3] bg-stone-100 dark:bg-stone-900 overflow-hidden">
                    <Link href={`/menu/${item.slug}`} className="block w-full h-full">
                      <Image
                        src={item.imageSrc || '/images/pizza-margherita.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-106 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>

                    {/* Top-Left Quality Badge */}
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <span className="bg-napoli-red text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                        Bestseller
                      </span>
                    </div>

                    {/* Top-Right Favorite Heart Icon (Picture 2 style) */}
                    <button
                      type="button"
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                      aria-label={`Favorit ${item.name}`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                          isFav ? 'fill-napoli-red text-napoli-red' : 'text-stone-400 hover:text-napoli-red'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Card Content: Inspired by Picture 2 (Girls Beauty style) */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div className="space-y-1">
                      {/* Brand / Category Line */}
                      <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 truncate block">
                        Little Napoli • {item.categorySlug.replace(/-/g, ' ')}
                      </span>

                      {/* Title */}
                      <Link href={`/menu/${item.slug}`}>
                        <h4 className="font-poppins text-xs sm:text-sm md:text-base font-bold text-stone-900 dark:text-white leading-tight group-hover:text-napoli-red dark:group-hover:text-red-400 transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                      </Link>

                      {/* Rating Row (Picture 2 style) */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-stone-500 dark:text-stone-400 pt-0.5">
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        <span className="font-bold text-stone-800 dark:text-stone-200">4.9</span>
                        <span className="text-stone-400 dark:text-stone-500">({28 + item.id * 7})</span>
                      </div>
                    </div>

                    {/* Divider & Bottom Row: Price + Picture 2 Cart Button */}
                    <div className="pt-2 border-t border-dashed border-stone-200/80 dark:border-stone-800/80 flex items-center justify-between gap-1">
                      <div>
                        <span className="font-poppins text-sm sm:text-base md:text-lg font-extrabold text-stone-900 dark:text-white leading-none block">
                          {formatEuro(item.price)}
                        </span>
                        <span className="block text-[8px] sm:text-[9px] text-stone-400 font-mono mt-0.5">
                          {item.isAlcoholic ? 'inkl. 20% USt' : 'inkl. 10% USt'}
                        </span>
                      </div>

                      {/* Add to Cart Soft Icon Button (Picture 2 style) */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                          isAdded
                            ? 'bg-emerald-600 text-white scale-105'
                            : 'border border-red-200 dark:border-red-900/50 bg-red-50/90 dark:bg-red-950/30 text-napoli-red dark:text-red-400 hover:bg-napoli-red hover:text-white active:scale-95'
                        }`}
                        title={isAdded ? 'Im Korb' : 'In den Warenkorb'}
                        aria-label={`${item.name} in den Warenkorb`}
                      >
                        {isAdded ? (
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                        ) : (
                          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Big CTA: Fully responsive, zero clipping on mobile */}
          <div className="pt-8 px-2 flex justify-center w-full">
            <Link href="/menu" className="w-full sm:w-auto max-w-sm sm:max-w-md block">
              <Button
                className="w-full sm:w-auto bg-napoli-char hover:bg-stone-800 dark:bg-white dark:hover:bg-stone-200 text-white dark:text-napoli-char font-bold text-xs sm:text-sm py-3.5 px-4 sm:px-8 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 whitespace-normal text-center h-auto leading-snug"
              >
                <span>{locale === 'en' ? 'Explore Full Menu (51 Items)' : 'Speisekarte ansehen (51 Gerichte)'}</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
