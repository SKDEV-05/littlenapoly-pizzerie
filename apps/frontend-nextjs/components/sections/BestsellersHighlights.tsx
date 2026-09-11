'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { useCartStore } from '@/lib/cart';
import { Plus, Check, ArrowRight, Flame, Sparkles, Award } from 'lucide-react';
import { MenuItemData } from './MenuGrid';

const BESTSELLERS: (MenuItemData & { tag: string; tagColor: string })[] = [
  {
    id: 2,
    slug: 'regina-margherita',
    name: 'Regina Margherita',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Basilikum',
    price: 9.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    tag: 'Der Klassiker',
    tagColor: 'bg-napoli-red text-white',
  },
  {
    id: 15,
    slug: 'yellow-bufala',
    name: 'Yellow Bufala',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Büffelmozzarella D.O.P., Marinierte Kirschtomaten, Basilikum Pesto',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    tag: 'Pizze Gialle Signature',
    tagColor: 'bg-napoli-yellow text-napoli-char',
  },
  {
    id: 21,
    slug: 'sophia-loren',
    name: 'Sophia Loren',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'Fior di Latte aus Sorrento, Pistazienmortadella, Pistazien, Pistaziencreme, Basilikum',
    price: 16.60,
    isAlcoholic: false,
    allergens: ['A', 'G', 'H'],
    tag: 'Gourmet Favorit',
    tagColor: 'bg-stone-800 text-white',
  },
  {
    id: 22,
    slug: 'calzone-vaticano',
    name: 'Calzone Vaticano',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Prosciutto Cotto, Salami, Champignons, Basilikum',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    tag: 'Ofenfrisch Gefüllt',
    tagColor: 'bg-napoli-redDark text-white',
  },
  {
    id: 5,
    slug: 'diabola-2-0',
    name: 'Diabola 2.0',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Scharfe Salami, Jalapeño-Creme, Basilikum',
    price: 14.30,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    tag: 'Pikant & Feurig',
    tagColor: 'bg-orange-600 text-white',
  },
  {
    id: 42,
    slug: 'hausgemachtes-tiramisu',
    name: 'Hausgemachtes Tiramisu',
    categorySlug: 'dolci',
    ingredients: 'Originales Tiramisù nach traditionellem Geheimrezept mit feinstem Mascarpone (alkoholfrei)',
    price: 6.50,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    tag: 'Dolci Artigianali',
    tagColor: 'bg-amber-700 text-white',
  },
];

export function BestsellersHighlights() {
  const [addedItemId, setAddedItemId] = useState<number | null>(null);
  const addItem = useCartStore((state) => state.addItem);

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
    setTimeout(() => setAddedItemId(null), 1200);
  };

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(amount);

  return (
    <section className="py-20 bg-background">
      <div className="container px-4 md:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="napoli" className="gap-1 px-3 py-1">
              <Award className="w-3.5 h-3.5 fill-white" />
              Unsere Bestseller
            </Badge>
            <Badge variant="outline" className="bg-white/80 text-xs">
              Top 6 Highlights
            </Badge>
          </div>
          <h2 className="font-poppins text-3xl sm:text-4xl lg:text-5xl font-bold text-napoli-char">
            Beliebteste Spezialitäten
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Die Favoriten unserer Gäste in Himberg — zubereitet mit originalen D.O.P. Zutaten und 48 Stunden gereiftem Teig.
          </p>
        </div>

        {/* 6 Dish Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BESTSELLERS.map((dish) => (
            <Card
              key={dish.id}
              className="flex flex-col justify-between hover:shadow-xl hover:border-napoli-red/40 transition-all duration-300 border-border/80 bg-white group"
            >
              <CardHeader className="pb-3 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${dish.tagColor}`}
                  >
                    {dish.tag}
                  </span>
                  <span className="font-poppins font-bold text-xl text-napoli-red">
                    {formatEuro(dish.price)}
                  </span>
                </div>
                <CardTitle className="font-poppins text-xl font-bold text-napoli-char group-hover:text-napoli-red transition-colors">
                  {dish.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {dish.ingredients}
                </p>

                {dish.allergens.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-muted-foreground font-medium">Allergene:</span>
                    {dish.allergens.map((code) => (
                      <AllergenBadge key={code} code={code} />
                    ))}
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-3 border-t border-border/50 flex justify-between items-center bg-stone-50/50 rounded-b-xl">
                <span className="text-[11px] text-muted-foreground font-mono">
                  10% österr. USt
                </span>
                <Button
                  size="sm"
                  variant={addedItemId === dish.id ? 'secondary' : 'napoli'}
                  onClick={() => handleAddToCart(dish)}
                  className="gap-1.5 text-xs font-semibold shadow-sm"
                >
                  {addedItemId === dish.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-napoli-green" />
                      Hinzugefügt!
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      In den Warenkorb
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Big CTA to Full Menu Page */}
        <div className="text-center pt-6">
          <div className="bg-gradient-to-r from-napoli-cream via-white to-napoli-cream border border-border p-8 rounded-3xl max-w-3xl mx-auto space-y-4 shadow-sm">
            <h3 className="font-poppins text-2xl font-bold text-napoli-char">
              Möchten Sie alle 51 Spezialitäten entdecken?
            </h3>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Von Pizze Classiche über sonnige Pizze Gialle, handgemachte Pasta bis zu Dolci und italienischen Spezialbieren.
            </p>
            <div className="pt-2">
              <Link href="/menu">
                <Button
                  variant="napoli"
                  size="lg"
                  className="gap-2.5 text-base px-8 py-6 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Gesamte Speisekarte ansehen (51 Spezialitäten)
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
