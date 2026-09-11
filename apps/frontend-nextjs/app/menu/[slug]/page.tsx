'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound, useParams, useRouter } from 'next/navigation';
import { CANONICAL_MENU_DATA } from '@/components/sections/MenuGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { useCartStore } from '@/lib/cart';
import {
  Plus,
  Minus,
  Check,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Flame,
  Wheat,
  Clock,
  Award,
} from 'lucide-react';

export default function PizzaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const item = CANONICAL_MENU_DATA.find((i) => i.slug === slug);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!item) {
    return notFound();
  }

  // Determine appropriate image based on dish type
  const getImageForItem = () => {
    if (item.categorySlug === 'pizze-gialle') return '/images/pizza-gialla.jpg';
    if (item.slug === 'diabola-2-0' || item.slug === 'salame') return '/images/pizza-diavola.jpg';
    if (item.categorySlug === 'pizze-bianche-calzone') return '/images/pizza-formaggi.jpg';
    return '/images/pizza-margherita.jpg';
  };

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        slug: item.slug,
        name: item.name,
        unitPrice: item.price,
        isAlcoholic: item.isAlcoholic,
        categorySlug: item.categorySlug,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleDirectCheckout = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: item.id,
        slug: item.slug,
        name: item.name,
        unitPrice: item.price,
        isAlcoholic: item.isAlcoholic,
        categorySlug: item.categorySlug,
      });
    }
    router.push('/order');
  };

  return (
    <div className="py-10 md:py-16 bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] min-h-screen transition-colors duration-300">
      <div className="container px-4 md:px-8 max-w-6xl mx-auto space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="hover:text-napoli-red dark:hover:text-red-400 transition-colors">
            Startseite
          </Link>
          <span>/</span>
          <Link href="/menu" className="hover:text-napoli-red dark:hover:text-red-400 transition-colors">
            Speisekarte
          </Link>
          <span>/</span>
          <span className="text-stone-900 dark:text-white font-semibold">{item.name}</span>
        </div>

        {/* Product Showcase Card */}
        <div className="bg-white dark:bg-[#1A1411] rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl dark:shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 md:p-12 items-center transition-colors duration-300">
          
          {/* Left: Giant Top-Down Pizza Photography */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-[420px] aspect-square group">
              {/* Warm Soft Glow Shadow */}
              <div className="absolute inset-4 rounded-full bg-amber-500/20 blur-3xl -z-10" />

              <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={getImageForItem()}
                  alt={item.name}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 420px"
                />
              </div>

              {/* Pizza Badge */}
              <div className="absolute -bottom-2 right-4 bg-white/95 dark:bg-[#221B16]/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-stone-200 dark:border-stone-700 flex items-center gap-1.5 text-xs font-semibold text-stone-900 dark:text-stone-100">
                <Flame className="w-3.5 h-3.5 text-napoli-red" />
                <span>485°C Holzofenfrisch</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details, Ingredients, Allergens & Order Buttons */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="napoli" className="text-xs">
                  Original Neapolitanisch
                </Badge>
                <Badge variant="outline" className="text-xs bg-muted/30 dark:bg-stone-800/40 dark:text-stone-300 dark:border-stone-700">
                  {item.categorySlug.replace(/-/g, ' ').toUpperCase()}
                </Badge>
              </div>

              <h1 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-extrabold text-napoli-char dark:text-white">
                {item.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-poppins text-3xl sm:text-4xl font-bold text-napoli-red dark:text-red-400">
                  {formatEuro(item.price)}
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  {item.isAlcoholic ? 'inkl. 20% österr. USt' : 'inkl. 10% österr. USt'}
                </span>
              </div>
            </div>

            {/* Ingredients */}
            <div className="space-y-1.5 bg-stone-50 dark:bg-[#221B16] rounded-2xl p-4 border border-stone-200 dark:border-stone-800/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                Zutaten & Rezeptur:
              </h2>
              <p className="text-sm sm:text-base text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {item.ingredients}
              </p>
            </div>

            {/* Quality Seals */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center">
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto" />
                <span className="block text-[11px] font-bold text-napoli-char dark:text-white leading-tight">48 Std.</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">Teigruhe</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <Flame className="w-4 h-4 text-napoli-red mx-auto" />
                <span className="block text-[11px] font-bold text-napoli-char dark:text-white leading-tight">485 °C</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">Holzofenhitze</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-[#221B16] border border-stone-200/80 dark:border-stone-800 space-y-1">
                <Award className="w-4 h-4 text-napoli-green mx-auto" />
                <span className="block text-[11px] font-bold text-napoli-char dark:text-white leading-tight">D.O.P.</span>
                <span className="text-[9px] text-stone-500 dark:text-stone-400">Zertifiziert</span>
              </div>
            </div>

            {/* Allergens (Austrian Codex A-R) */}
            {item.allergens.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Enthaltene Allergene nach österr. Codex:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.allergens.map((code) => (
                    <AllergenBadge key={code} code={code} />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Checkout Action */}
            <div className="space-y-3 pt-4 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Menge:</span>
                <div className="flex items-center border border-stone-200 dark:border-stone-800 rounded-xl bg-stone-50 dark:bg-[#221B16]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 rounded-l-xl transition-colors"
                    aria-label="Menge verringern"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-sm font-bold font-mono text-napoli-char dark:text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-stone-600 dark:text-stone-300 hover:text-black dark:hover:text-white hover:bg-stone-200 dark:hover:bg-stone-800 rounded-r-xl transition-colors"
                    aria-label="Menge erhöhen"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm font-bold text-napoli-char dark:text-white ml-auto font-mono">
                  Gesamt: {formatEuro(item.price * quantity)}
                </span>
              </div>

              {/* Order Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <Button
                  size="lg"
                  variant={added ? 'secondary' : 'napoli'}
                  onClick={handleAddToCart}
                  className="gap-2 font-bold shadow-md text-sm rounded-xl py-6 cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-napoli-green" />
                      In den Warenkorb gelegt!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      In den Warenkorb
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  onClick={handleDirectCheckout}
                  className="bg-napoli-char dark:bg-stone-800 hover:bg-black dark:hover:bg-stone-700 text-white font-bold gap-2 shadow-md text-sm rounded-xl py-6 cursor-pointer"
                >
                  Direkt zur Kassa
                  <ArrowRight className="w-4 h-4 text-napoli-yellow" />
                </Button>
              </div>
            </div>

            {/* Back to Menu Link */}
            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-napoli-red dark:hover:text-red-400 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Zurück zur gesamten Speisekarte (51 Spezialitäten)
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
