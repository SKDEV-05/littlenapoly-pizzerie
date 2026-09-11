'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AllergenBadge } from '@/components/ui/AllergenBadge';
import { useCartStore } from '@/lib/cart';
import { useFavoritesStore } from '@/lib/favorites';
import { useI18n } from '@/lib/i18n';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ShoppingBag,
  Check,
  Heart,
  Flame,
  ArrowUpDown,
  X,
  Filter,
  Sparkles,
  Plus,
  Star,
} from 'lucide-react';

export interface MenuItemData {
  id: number;
  slug: string;
  name: string;
  categorySlug: string;
  ingredients: string;
  ingredientsEn?: string;
  price: number;
  isAlcoholic: boolean;
  servingSize?: string;
  allergens: string[];
  imageSrc?: string;
}

// 51 Canonical Items Static Registry with High-Resolution Dish Photography
export const CANONICAL_MENU_DATA: MenuItemData[] = [
  // Classiche (1-13)
  {
    id: 1,
    slug: 'marinara',
    name: 'Marinara',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Oregano, Knoblauch, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, oregano, fresh garlic, basil & extra virgin olive oil',
    price: 8.50,
    isAlcoholic: false,
    allergens: ['A'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 2,
    slug: 'regina-margherita',
    name: 'Regina Margherita',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Sorrento Fior di Latte, fresh basil & extra virgin olive oil',
    price: 9.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 3,
    slug: 'cotto',
    name: 'Cotto',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Prosciutto Cotto, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Sorrento Fior di Latte, Italian cooked ham, basil',
    price: 13.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 4,
    slug: 'salame',
    name: 'Salame',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Salami aus Neapel, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Sorrento Fior di Latte, Neapolitan salami, basil',
    price: 13.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 5,
    slug: 'diabola-2-0',
    name: 'Diabola 2.0',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Scharfe Salami, Jalapeño-Creme, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, spicy salami, velvety jalapeño cream, basil',
    price: 14.30,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 6,
    slug: 'bufala',
    name: 'Bufala',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Büffelmozzarella aus Neapel D.O.P., Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Neapolitan Buffalo Mozzarella D.O.P., basil',
    price: 13.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 7,
    slug: 'vegetariana',
    name: 'Vegetariana',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Frisches Grillgemüse, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, fresh grilled vegetables, basil',
    price: 14.60,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 8,
    slug: 'testa-rossa',
    name: 'Testa Rossa',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Marinierte Sardellenfilets, Kapern, Oliven, Halbgetrocknete Tomaten, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, marinated anchovy fillets, capers, olives, semi-dried tomatoes, basil',
    price: 14.70,
    isAlcoholic: false,
    allergens: ['A', 'D', 'O'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 9,
    slug: '4-stagioni',
    name: '4 Stagioni',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Prosciutto Cotto, Salami aus Neapel, Artischocken, Oliven, Champignons, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, cooked ham, Neapolitan salami, artichokes, olives, mushrooms, basil',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 10,
    slug: 'red-passion',
    name: 'Red Passion',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Rucola, Prosciutto Crudo San Daniele 24 Monate D.O.P., Marinierte Kirschtomaten, Grana Padano, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, wild rocket, 24-month San Daniele prosciutto, cherry tomatoes, Grana Padano D.O.P.',
    price: 15.50,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },
  {
    id: 11,
    slug: 'tropea',
    name: 'Tropea',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Karamellisierte rote Zwiebel, Oliven, Thunfisch, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, caramelized red Tropea onions, olives, tuna, basil',
    price: 13.50,
    isAlcoholic: false,
    allergens: ['A', 'D', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 12,
    slug: 'secret-love',
    name: 'Secret Love',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Getrocknete Tomaten, Marinierte Kirschtomaten (Gelb & Rot), Ligurisches Pesto',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, sun-dried tomatoes, marinated cherry tomatoes, Ligurian basil pesto',
    price: 14.60,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-margherita.jpg',
  },
  {
    id: 13,
    slug: 'bresaola-valtellinese',
    name: 'Bresaola Valtellinese',
    categorySlug: 'le-pizze-classiche',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Rucola, Marinierte Kirschtomaten (Gelb & Rot), Bresaola Valtellinese',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, wild rocket, marinated cherry tomatoes, cured Bresaola Valtellinese',
    price: 16.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-diavola.jpg',
  },

  // Gialle (14-19)
  {
    id: 14,
    slug: 'yellow-marinara',
    name: 'Yellow Marinara',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Oregano, Knoblauch, Basilikum',
    ingredientsEn: 'Yellow date tomato sauce, oregano, fresh garlic, basil & olive oil',
    price: 8.50,
    isAlcoholic: false,
    allergens: ['A'],
    imageSrc: '/images/pizza-gialla.jpg',
  },
  {
    id: 15,
    slug: 'yellow-bufala',
    name: 'Yellow Bufala',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Büffelmozzarella D.O.P., Marinierte Kirschtomaten (Gelb & Rot), Basilikum Pesto',
    ingredientsEn: 'Yellow date tomato sauce, Buffalo Mozzarella D.O.P., marinated yellow & red cherry tomatoes, basil pesto',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-gialla.jpg',
  },
  {
    id: 16,
    slug: 'mediterranea',
    name: 'Mediterranea',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Fior di Latte aus Sorrento, Karamellisierte rote Zwiebel, Halbgetrocknete Tomaten, Thunfisch, Oregano, Basilikum',
    ingredientsEn: 'Yellow date tomato sauce, Fior di Latte, caramelized red onions, semi-dried tomatoes, tuna, oregano, basil',
    price: 14.80,
    isAlcoholic: false,
    allergens: ['A', 'D', 'G'],
    imageSrc: '/images/pizza-gialla.jpg',
  },
  {
    id: 17,
    slug: 'testa-gialla',
    name: 'Testa Gialla',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Knoblauch, Kapern, Oliven, Sardellen, Marinierte Kirschtomaten (Gelb & Rot), Basilikum',
    ingredientsEn: 'Yellow date tomato sauce, garlic, capers, olives, anchovies, marinated cherry tomatoes, basil',
    price: 14.70,
    isAlcoholic: false,
    allergens: ['A', 'D'],
    imageSrc: '/images/pizza-gialla.jpg',
  },
  {
    id: 18,
    slug: 'super-parmigiana',
    name: 'Super Parmigiana',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Fior di Latte aus Sorrento, Gegrillte Melanzani, Grana Padano 24 Monate D.O.P., Basilikum',
    ingredientsEn: 'Yellow date tomato sauce, Fior di Latte, grilled aubergine, 24-month Grana Padano D.O.P., basil',
    price: 14.60,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-gialla.jpg',
  },
  {
    id: 19,
    slug: 'yellow-margherita',
    name: 'Yellow Margherita',
    categorySlug: 'pizze-gialle',
    ingredients: 'Gelbe Datteltomatensauce, Fior di Latte aus Sorrento, Basilikum',
    ingredientsEn: 'Yellow date tomato sauce, Sorrento Fior di Latte, fresh basil & extra virgin olive oil',
    price: 10.50,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-gialla.jpg',
  },

  // Bianche & Calzone (20-23)
  {
    id: 20,
    slug: '4-formaggi',
    name: '4 Formaggi',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'Fior di Latte aus Sorrento, Grana Padano 24 Monate D.O.P., Gorgonzola Dolce D.O.P., Ricotta, Roter Pfeffer, Basilikum',
    ingredientsEn: 'Sorrento Fior di Latte, 24-month Grana Padano D.O.P., Gorgonzola Dolce D.O.P., delicate ricotta, pink pepper, basil',
    price: 14.60,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-formaggi.jpg',
  },
  {
    id: 21,
    slug: 'sophia-loren',
    name: 'Sophia Loren',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'Fior di Latte aus Sorrento, Pistazienmortadella, Pistazien, Pistaziencreme, Basilikum',
    ingredientsEn: 'Fior di Latte, Italian pistachio mortadella, roasted pistachios, pistachio cream, fresh basil',
    price: 16.60,
    isAlcoholic: false,
    allergens: ['A', 'G', 'H'],
    imageSrc: '/images/pizza-formaggi.jpg',
  },
  {
    id: 22,
    slug: 'calzone-vaticano',
    name: 'Calzone Vaticano',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'San Marzano Tomatensauce, Fior di Latte aus Sorrento, Prosciutto Cotto, Salami, Champignons, Basilikum',
    ingredientsEn: 'San Marzano tomato sauce, Fior di Latte, cooked ham, Italian salami, mushrooms, fresh basil folded calzone',
    price: 14.90,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: '/images/pizza-formaggi.jpg',
  },
  {
    id: 23,
    slug: 'calzone-emotion',
    name: 'Calzone Emotion',
    categorySlug: 'pizze-bianche-calzone',
    ingredients: 'Gelbe Datteltomatensauce, Fior di Latte aus Sorrento, Pistazienmortadella',
    ingredientsEn: 'Yellow date tomato sauce, Fior di Latte, Italian pistachio mortadella',
    price: 15.80,
    isAlcoholic: false,
    allergens: ['A', 'G', 'H'],
    imageSrc: '/images/pizza-formaggi.jpg',
  },

  // Antipasti & Insalata (24-30)
  {
    id: 24,
    slug: 'focaccia-knoblauch',
    name: 'Focaccia Knoblauch',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Frische Focaccia mit feinem Knoblauchöl und Rosmarin',
    ingredientsEn: 'Fresh warm focaccia bread with garlic olive oil and fresh rosemary',
    price: 5.50,
    isAlcoholic: false,
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 25,
    slug: 'focaccia-pesto',
    name: 'Focaccia Pesto',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Frische Focaccia mit ligurischem Basilikumpesto',
    ingredientsEn: 'Fresh baked focaccia drizzled with fragrant Ligurian basil pesto',
    price: 5.50,
    isAlcoholic: false,
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 26,
    slug: 'focaccia-chili',
    name: 'Focaccia Chili',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Frische Focaccia mit kalabrischem Chiliöl',
    ingredientsEn: 'Freshly baked focaccia with fiery Calabrian chili oil',
    price: 5.50,
    isAlcoholic: false,
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 27,
    slug: 'caprese-di-bufala',
    name: 'Caprese di Bufala',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Rucola, Marinierte Kirschtomaten (rot-gelb), Büffelmozzarella D.O.P.',
    ingredientsEn: 'Wild rocket, marinated red & yellow cherry tomatoes, authentic Buffalo Mozzarella D.O.P.',
    price: 13.50,
    isAlcoholic: false,
    allergens: ['G'],
    imageSrc: 'https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 28,
    slug: 'insalata-rucola',
    name: 'Insalata Rucola',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Rucola, Marinierte Kirschtomaten, Grana Padano 24 Monate D.O.P.',
    ingredientsEn: 'Crisp wild rocket, marinated cherry tomatoes, 24-month Grana Padano D.O.P. shavings',
    price: 8.90,
    isAlcoholic: false,
    allergens: ['G'],
    imageSrc: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 29,
    slug: 'insalata-pinna-gialla',
    name: 'Insalata Pinna Gialla',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Thunfisch, Zwiebel, Marinierte Kirschtomaten, Oliven, Olivenöl',
    ingredientsEn: 'Yellowfin tuna, red onions, marinated cherry tomatoes, Kalamata olives, extra virgin olive oil',
    price: 10.90,
    isAlcoholic: false,
    allergens: ['D'],
    imageSrc: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 30,
    slug: 'insalata-verde',
    name: 'Insalata Verde (Beilagensalat)',
    categorySlug: 'antipasti-insalata',
    ingredients: 'Blattsalat, Olivenöl',
    ingredientsEn: 'Fresh mixed green leaf salad with extra virgin olive oil dressing',
    price: 4.80,
    isAlcoholic: false,
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
  },

  // Pasta Fatta in Casa (31-39)
  {
    id: 31,
    slug: 'spaghetti-pomodoro',
    name: 'Spaghetti Pomodoro (350g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Tomatensauce, Grana Padano, Basilikum',
    ingredientsEn: 'Homemade spaghetti, San Marzano tomato sauce, aged Grana Padano, fresh basil',
    price: 9.90,
    isAlcoholic: false,
    servingSize: '350g',
    allergens: ['A', 'L'],
    imageSrc: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 32,
    slug: 'tagliatelle-ragou-bolognese',
    name: 'Tagliatelle Ragou Bolognese (300g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Ragou Bolognese (gemischt), Grana Padano, Basilikum',
    ingredientsEn: 'Fresh handmade tagliatelle with rich slow-cooked Bolognese meat ragù, Grana Padano & basil',
    price: 12.50,
    isAlcoholic: false,
    servingSize: '300g',
    allergens: ['A', 'C', 'G', 'L'],
    imageSrc: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 33,
    slug: 'garganelli-al-salmone',
    name: 'Garganelli Al Salmone (300g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Räucherlachs, Getrocknete Tomaten, Basilikum',
    ingredientsEn: 'Artisan garganelli with smoked salmon, sun-dried tomatoes and delicate herb cream sauce',
    price: 12.90,
    isAlcoholic: false,
    servingSize: '300g',
    allergens: ['A', 'C', 'D', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 34,
    slug: 'raviolo-pomodoro-datterino',
    name: 'Raviolo Pomodoro Datterino (350g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Mit Ricotta gefüllte Ravioli, Datteltomatensauce, Basilikum, Grana Padano',
    ingredientsEn: 'Handmade ravioli filled with fresh ricotta, sweet date tomato sauce, basil, Grana Padano',
    price: 12.50,
    isAlcoholic: false,
    servingSize: '350g',
    allergens: ['A', 'C', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 35,
    slug: 'penne-arrabbiata',
    name: 'Penne Arrabbiata (350g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Scharfe Tomatensauce, Grana Padano, Basilikum',
    ingredientsEn: 'Penne in fiery chili-garlic San Marzano tomato sauce, Grana Padano & fresh basil',
    price: 11.50,
    isAlcoholic: false,
    servingSize: '350g',
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 36,
    slug: 'gnocchi-pomodoro-e-mozzarella',
    name: 'Gnocchi Pomodoro E Mozzarella (350g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Tomatensauce, Mozzarella, Grana Padano, Basilikum',
    ingredientsEn: 'Handcrafted potato gnocchi with San Marzano sauce, melted mozzarella, Grana Padano & basil',
    price: 12.30,
    isAlcoholic: false,
    servingSize: '350g',
    allergens: ['A', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 37,
    slug: 'strozzapreti',
    name: 'Strozzapreti (300g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Steinpilzsauce mit Speck, Grana Padano, Basilikum',
    ingredientsEn: 'Traditional strozzapreti pasta with porcini mushroom & smoked bacon cream sauce, Grana Padano',
    price: 13.30,
    isAlcoholic: false,
    servingSize: '300g',
    allergens: ['A', 'C', 'F', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 38,
    slug: 'gramigna-panna-salsiccia',
    name: 'Gramigna Panna Salsiccia (350g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Obersauce mit Salsiccia Wurst, Grana Padano, Basilikum',
    ingredientsEn: 'Emilian gramigna pasta with Italian salsiccia sausage, delicate cream sauce & Grana Padano',
    price: 13.50,
    isAlcoholic: false,
    servingSize: '350g',
    allergens: ['A', 'C', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 39,
    slug: 'lasagne-caserecce',
    name: 'Lasagne Caserecce (500g)',
    categorySlug: 'pasta-fatta-in-casa',
    ingredients: 'Ragú Bolognese (gemischt), Béchamel, Grana Padano',
    ingredientsEn: 'Traditional layered homemade lasagne with slow-braised Bolognese ragù, creamy béchamel & Grana Padano',
    price: 13.90,
    isAlcoholic: false,
    servingSize: '500g',
    allergens: ['A', 'C', 'G', 'L'],
    imageSrc: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
  },

  // Dolci (40-43)
  {
    id: 40,
    slug: 'dolce-vita',
    name: 'Dolce Vita (Für 2 Personen)',
    categorySlug: 'dolci',
    ingredients: 'Süße Pizza mit Nutella und frischen Früchten',
    ingredientsEn: 'Warm dessert pizza topped with creamy Nutella, fresh strawberries and bananas (for 2 people)',
    price: 12.90,
    isAlcoholic: false,
    allergens: ['A', 'F', 'G', 'H'],
    imageSrc: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 41,
    slug: 'roccia',
    name: 'Roccia (Für 2 Personen)',
    categorySlug: 'dolci',
    ingredients: 'Süße Pizza mit Pistaziencreme, Ferrero Rocher und frischen Früchten',
    ingredientsEn: 'Sweet dessert pizza with Sicilian pistachio cream, crushed Ferrero Rocher & fresh berries',
    price: 13.90,
    isAlcoholic: false,
    allergens: ['A', 'F', 'G', 'H'],
    imageSrc: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 42,
    slug: 'hausgemachtes-tiramisu',
    name: 'Hausgemachtes Tiramisu',
    categorySlug: 'dolci',
    ingredients: 'Originales Tiramisù mit feinem Mascarpone (alkoholfrei)',
    ingredientsEn: 'Authentic Italian homemade tiramisù with delicate mascarpone cream and espresso (alcohol-free)',
    price: 6.50,
    isAlcoholic: false,
    allergens: ['A', 'G'],
    imageSrc: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 43,
    slug: 'pistazienprofiterol',
    name: 'Pistazienprofiterol',
    categorySlug: 'dolci',
    ingredients: 'Gefüllte Brandteigkugeln mit Pistaziencreme',
    ingredientsEn: 'Golden choux pastry profiteroles filled with luscious Sicilian pistachio cream',
    price: 6.50,
    isAlcoholic: false,
    allergens: ['A', 'C', 'G', 'H'],
    imageSrc: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80',
  },

  // Getränke & Bier (44-51)
  {
    id: 44,
    slug: 'san-benedetto-still',
    name: 'San Benedetto still (0,5L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Natürliches italienisches Mineralwasser still',
    ingredientsEn: 'Natural still Italian mineral water from the Venetian Alps',
    price: 2.20,
    isAlcoholic: false,
    servingSize: '0,5L',
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 45,
    slug: 'san-benedetto-prickelnd',
    name: 'San Benedetto prickelnd (0,5L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Natürliches italienisches Mineralwasser prickelnd',
    ingredientsEn: 'Sparkling Italian mineral water from the Venetian Alps',
    price: 2.20,
    isAlcoholic: false,
    servingSize: '0,5L',
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 46,
    slug: 'fritz-kola',
    name: 'Fritz-Kola / Super Zero (0,33L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Fritz Kola mit viel Koffein oder zuckerfrei',
    ingredientsEn: 'Fritz Kola with real kola nut extract or sugar-free Super Zero',
    price: 3.70,
    isAlcoholic: false,
    servingSize: '0,33L',
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 47,
    slug: 'fritz-kola-schorle',
    name: 'Fritz-Kola Bio Schorle (0,33L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Bio Apfelschorle oder Traubenschorle',
    ingredientsEn: 'Organic sparkling fruit spritzer (organic apple or grape)',
    price: 3.70,
    isAlcoholic: false,
    servingSize: '0,33L',
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 48,
    slug: 'estathe-pesca-limone',
    name: 'Estathé Pesca / Limone',
    categorySlug: 'getraenke-bier',
    ingredients: 'Italienischer Eistee Pfirsich oder Zitrone',
    ingredientsEn: 'Famous authentic Italian iced tea (peach or lemon)',
    price: 3.50,
    isAlcoholic: false,
    servingSize: '0,33L',
    allergens: [],
    imageSrc: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 49,
    slug: 'ichnusa-non-filtrata',
    name: 'Ichnusa non-filtrata (0,33L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Unfiltriertes sardisches Spezialbier (20% USt)',
    ingredientsEn: 'Unfiltered golden Sardinian specialty craft beer (5.0% ABV)',
    price: 4.50,
    isAlcoholic: true,
    servingSize: '0,33L',
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1608270199144-883955627e70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 50,
    slug: 'birra-moretti',
    name: 'Birra Moretti (0,33L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Traditionelles italienisches Lagerbier (20% USt)',
    ingredientsEn: 'Traditional authentic Italian premium blonde lager (4.6% ABV)',
    price: 4.50,
    isAlcoholic: true,
    servingSize: '0,33L',
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1608270199144-883955627e70?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 51,
    slug: 'messina-cristalli-di-sale',
    name: 'Messina Cristalli di Sale (0,33L)',
    categorySlug: 'getraenke-bier',
    ingredients: 'Sizilianisches Spezialbier mit Meersalz (20% USt)',
    ingredientsEn: 'Sicilian specialty beer brewed with sea salt crystals from Trapani (5.0% ABV)',
    price: 4.50,
    isAlcoholic: true,
    servingSize: '0,33L',
    allergens: ['A'],
    imageSrc: 'https://images.unsplash.com/photo-1608270199144-883955627e70?auto=format&fit=crop&w=600&q=80',
  },
];

type PriceRange = 'all' | 'under-10' | '10-15' | 'over-15';
type DietaryFilter = 'all' | 'favorites' | 'dop' | 'vegetarian' | 'spicy';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

interface MenuGridProps {
  showHeader?: boolean;
}

function MenuGridInner({ showHeader = true }: MenuGridProps) {
  const { locale, t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read initial category from URL ?category=...
  const urlCategory = searchParams.get('category');
  const [activeCategory, setActiveCategory] = useState<string>(urlCategory || 'all');
  const [priceFilter, setPriceFilter] = useState<PriceRange>('all');
  const [dietaryFilter, setDietaryFilter] = useState<DietaryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const favoriteIds = useFavoritesStore((state) => state.favoriteIds);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [addedItemId, setAddedItemId] = useState<number | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync category if URL search param changes
  useEffect(() => {
    if (urlCategory && urlCategory !== activeCategory) {
      setActiveCategory(urlCategory);
    } else if (!urlCategory && activeCategory !== 'all') {
      // Keep state if user navigated within page
    }
  }, [urlCategory]);

  const categories = [
    { slug: 'all', labelDe: 'Alle Spezialitäten', labelEn: 'All Specialties', count: 51 },
    {
      slug: 'favorites',
      labelDe: '❤️ Meine Favoriten',
      labelEn: '❤️ My Favorites',
      count: isMounted ? favoriteIds.length : 0,
    },
    { slug: 'le-pizze-classiche', labelDe: 'Le Pizze Classiche', labelEn: 'Classic Pizzas', count: 13 },
    { slug: 'pizze-gialle', labelDe: 'Le Pizze Gialle', labelEn: 'Yellow Tomato Pizzas', count: 6 },
    { slug: 'pizze-bianche-calzone', labelDe: 'Bianche & Calzone', labelEn: 'White & Calzone', count: 4 },
    { slug: 'antipasti-insalata', labelDe: 'Antipasti & Salate', labelEn: 'Antipasti & Salads', count: 7 },
    { slug: 'pasta-fatta-in-casa', labelDe: 'Hausgemachte Pasta', labelEn: 'Handmade Pasta', count: 9 },
    { slug: 'dolci', labelDe: 'Dolci Artigianali', labelEn: 'Artisanal Desserts', count: 4 },
    { slug: 'getraenke-bier', labelDe: 'Getränke & Wein', labelEn: 'Drinks & Beer', count: 8 },
  ];

  const priceFilters: { id: PriceRange; labelDe: string; labelEn: string }[] = [
    { id: 'all', labelDe: 'Alle Preise', labelEn: 'All Prices' },
    { id: 'under-10', labelDe: 'Unter €10', labelEn: 'Under €10' },
    { id: '10-15', labelDe: '€10 – €15', labelEn: '€10 – €15' },
    { id: 'over-15', labelDe: 'Über €15', labelEn: 'Over €15' },
  ];

  const dietaryFilters: { id: DietaryFilter; labelDe: string; labelEn: string }[] = [
    { id: 'all', labelDe: 'Alle Gerichte', labelEn: 'All Dishes' },
    {
      id: 'favorites',
      labelDe: `❤️ Meine Favoriten (${isMounted ? favoriteIds.length : 0})`,
      labelEn: `❤️ My Favorites (${isMounted ? favoriteIds.length : 0})`,
    },
    { id: 'dop', labelDe: 'D.O.P. Zertifiziert', labelEn: 'D.O.P. Certified' },
    { id: 'vegetarian', labelDe: 'Vegetarisch', labelEn: 'Vegetarian' },
    { id: 'spicy', labelDe: 'Scharf / Piccante', labelEn: 'Spicy' },
  ];

  const sortOptions: { id: SortOption; labelDe: string; labelEn: string }[] = [
    { id: 'featured', labelDe: 'Empfohlen & Bestseller', labelEn: 'Featured & Bestsellers' },
    { id: 'price-asc', labelDe: 'Preis: aufsteigend', labelEn: 'Price: Low to High' },
    { id: 'price-desc', labelDe: 'Preis: absteigend', labelEn: 'Price: High to Low' },
    { id: 'name-asc', labelDe: 'Name: A bis Z', labelEn: 'Name: A to Z' },
  ];

  const handleSelectCategory = (catSlug: string) => {
    setActiveCategory(catSlug);
    // Update URL query parameter
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (catSlug === 'all') {
        url.searchParams.delete('category');
      } else {
        url.searchParams.set('category', catSlug);
      }
      window.history.pushState({}, '', url.toString());
    }
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setPriceFilter('all');
    setDietaryFilter('all');
    setSearchQuery('');
    setSortBy('featured');
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('category');
      window.history.pushState({}, '', url.toString());
    }
  };

  const hasActiveFilters =
    activeCategory !== 'all' ||
    priceFilter !== 'all' ||
    dietaryFilter !== 'all' ||
    searchQuery.trim() !== '' ||
    sortBy !== 'featured';

  // Filter and Sort Items
  const filteredItems = useMemo(() => {
    const nonVegetarianKeywords = [
      'salami',
      'prosciutto',
      'cotto',
      'speck',
      'salsiccia',
      'bolognese',
      'ragú',
      'thunfisch',
      'sardellen',
      'anchovy',
      'tuna',
      'fleisch',
      'bresaola',
    ];

    let items = CANONICAL_MENU_DATA.filter((item) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favoriteIds.includes(item.id)) return false;
      } else if (activeCategory !== 'all' && item.categorySlug !== activeCategory) {
        return false;
      }

      // Price filter
      if (priceFilter === 'under-10' && item.price >= 10) return false;
      if (priceFilter === '10-15' && (item.price < 10 || item.price > 15)) return false;
      if (priceFilter === 'over-15' && item.price <= 15) return false;

      // Dietary filter
      if (dietaryFilter === 'favorites') {
        if (!favoriteIds.includes(item.id)) return false;
      }
      if (dietaryFilter === 'dop') {
        const text = (item.name + ' ' + item.ingredients).toLowerCase();
        if (!text.includes('d.o.p') && !text.includes('dop')) return false;
      }
      if (dietaryFilter === 'vegetarian') {
        const text = item.ingredients.toLowerCase();
        const hasMeat = nonVegetarianKeywords.some((kw) => text.includes(kw));
        if (hasMeat) return false;
      }
      if (dietaryFilter === 'spicy') {
        const text = (item.name + ' ' + item.ingredients).toLowerCase();
        const isSpicy =
          text.includes('scharf') ||
          text.includes('piccante') ||
          text.includes('jalapeño') ||
          text.includes('chili') ||
          text.includes('diabola');
        if (!isSpicy) return false;
      }

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesIngredientsDe = item.ingredients.toLowerCase().includes(query);
        const matchesIngredientsEn = item.ingredientsEn?.toLowerCase().includes(query) || false;
        return matchesName || matchesIngredientsDe || matchesIngredientsEn;
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-asc') {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      items = [...items].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
    }

    return items;
  }, [activeCategory, priceFilter, dietaryFilter, searchQuery, sortBy, favoriteIds]);

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
    setTimeout(() => setAddedItemId(null), 1500);
  };

  const formatEuro = (amount: number) =>
    new Intl.NumberFormat(locale === 'en' ? 'en-IE' : 'de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const activeCategoryObj = categories.find((c) => c.slug === activeCategory);

  return (
    <section className="py-8 md:py-14 bg-[#FAF7F2] dark:bg-[#0E0A08] transition-colors duration-300">
      <div className="container px-4 md:px-8 space-y-8 max-w-7xl mx-auto">
        
        {/* Optional Section Header */}
        {showHeader && (
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-napoli-red dark:text-red-400 font-bold px-3 py-1 rounded-full bg-napoli-red/10 border border-napoli-red/20 inline-block">
              Little Napoli • Himberg bei Wien
            </span>
            <h2 className="font-poppins text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 dark:text-white tracking-tight">
              {t('menu.title')}
            </h2>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base leading-relaxed">
              {t('menu.subtitle')}
            </p>
          </div>
        )}

        {/* Mobile Filter Toggle Trigger Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white dark:bg-[#1A1411] p-3 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-napoli-red text-white text-xs font-bold shadow-md cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{locale === 'en' ? 'Filters & Categories' : 'Filter & Kategorien'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
            )}
          </button>

          <span className="text-xs font-semibold text-stone-500 font-mono">
            {filteredItems.length} {locale === 'en' ? 'items' : 'Gerichte'}
          </span>
        </div>

        {/* ============================================================ */}
        {/* MAIN LAYOUT: LEFT SIDEBAR FILTERS + RIGHT PRODUCTS GRID      */}
        {/* (Inspired by Girls Beauty Picture 4)                         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR (Desktop Sticky & Mobile Slide Drawer)          */}
          {/* ============================================================ */}
          <aside
            className={`
              lg:col-span-3 bg-white dark:bg-[#1A1411] p-6 rounded-3xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-7 lg:sticky lg:top-24
              ${
                mobileFilterOpen
                  ? 'fixed inset-0 z-50 overflow-y-auto bg-white dark:bg-[#1A1411] p-6 rounded-none'
                  : 'hidden lg:block'
              }
            `}
          >
            {/* Sidebar Top: Filters Title + Reset */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2 text-stone-900 dark:text-white font-poppins font-extrabold text-lg">
                <SlidersHorizontal className="w-4 h-4 text-napoli-red" />
                <span>{locale === 'en' ? 'Filters' : 'Filter'}</span>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-xs text-napoli-red dark:text-red-400 font-bold hover:underline cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{locale === 'en' ? 'Reset' : 'Zurücksetzen'}</span>
                  </button>
                )}

                {/* Close Button on Mobile Drawer */}
                {mobileFilterOpen && (
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="lg:hidden p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Group 1: Categories with Item Counts */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                {locale === 'en' ? 'Category' : 'Kategorie'}
              </h4>

              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.slug;
                  const label = locale === 'en' ? cat.labelEn : cat.labelDe;

                  return (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        handleSelectCategory(cat.slug);
                        if (mobileFilterOpen) setMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center justify-between py-2 px-3 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-napoli-red/10 dark:bg-red-950/40 text-napoli-red dark:text-red-400 font-bold border-l-4 border-napoli-red pl-2.5 shadow-sm'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-900 font-medium'
                      }`}
                    >
                      <span className="truncate pr-2">{label}</span>
                      <span
                        className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-napoli-red text-white font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500'
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 2: Price Filter */}
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                {locale === 'en' ? 'Price Range' : 'Preisfilter'}
              </h4>

              <div className="space-y-1.5">
                {priceFilters.map((pf) => {
                  const isSelected = priceFilter === pf.id;
                  const label = locale === 'en' ? pf.labelEn : pf.labelDe;

                  return (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => {
                        setPriceFilter(pf.id);
                        if (mobileFilterOpen) setMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'text-napoli-red dark:text-red-400 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-napoli-red bg-napoli-red'
                            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 3: Dietary & Quality Badges */}
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-stone-400 dark:text-stone-500">
                {locale === 'en' ? 'Preferences' : 'Ernährung & Qualität'}
              </h4>

              <div className="space-y-1.5">
                {dietaryFilters.map((df) => {
                  const isSelected = dietaryFilter === df.id;
                  const label = locale === 'en' ? df.labelEn : df.labelDe;

                  return (
                    <button
                      key={df.id}
                      type="button"
                      onClick={() => {
                        setDietaryFilter(df.id);
                        if (mobileFilterOpen) setMobileFilterOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 py-1.5 px-3 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'text-napoli-red dark:text-red-400 font-bold'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-napoli-red bg-napoli-red'
                            : 'border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Apply Button */}
            {mobileFilterOpen && (
              <div className="pt-4 border-t border-stone-200">
                <Button
                  size="default"
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full bg-napoli-red text-white font-bold py-3 rounded-xl shadow-md"
                >
                  {locale === 'en' ? `Show ${filteredItems.length} Products` : `${filteredItems.length} Spezialitäten anzeigen`}
                </Button>
              </div>
            )}
          </aside>

          {/* ============================================================ */}
          {/* RIGHT PRODUCTS MAIN CONTENT AREA                             */}
          {/* ============================================================ */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Top Toolbar: Search, Product Count & Sort Dropdown */}
            <div className="bg-white dark:bg-[#1A1411] p-4 sm:p-5 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                
                {/* Search Field */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder={locale === 'en' ? 'Search ingredients or dish...' : 'Zutat oder Gericht suchen...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2 text-xs sm:text-sm bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-napoli-red/30 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort By Dropdown (Styled like Picture 4) */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
                    {locale === 'en' ? 'Sort by:' : 'Sortieren:'}
                  </span>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="appearance-none bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none cursor-pointer"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {locale === 'en' ? opt.labelEn : opt.labelDe}
                        </option>
                      ))}
                    </select>
                    <ArrowUpDown className="w-3 h-3 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
                  </div>
                </div>

              </div>

              {/* Status Header: "Showing X products" + Active Filter Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
                <span className="text-stone-600 dark:text-stone-300 font-medium">
                  {locale === 'en' ? 'Showing' : 'Zeige'}{' '}
                  <strong className="text-stone-900 dark:text-white font-extrabold">{filteredItems.length}</strong>{' '}
                  {locale === 'en' ? 'specialties' : 'Spezialitäten'}
                  {activeCategory !== 'all' && (
                    <>
                      {' in '}
                      <span className="text-napoli-red font-bold">
                        {locale === 'en' ? activeCategoryObj?.labelEn : activeCategoryObj?.labelDe}
                      </span>
                    </>
                  )}
                </span>

                {/* Active Filter Chips */}
                {hasActiveFilters && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeCategory !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <span>{locale === 'en' ? activeCategoryObj?.labelEn : activeCategoryObj?.labelDe}</span>
                        <button type="button" onClick={() => handleSelectCategory('all')} className="hover:text-napoli-red">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {priceFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <span>{priceFilters.find((f) => f.id === priceFilter)?.[locale === 'en' ? 'labelEn' : 'labelDe']}</span>
                        <button type="button" onClick={() => setPriceFilter('all')} className="hover:text-napoli-red">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {dietaryFilter !== 'all' && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <span>{dietaryFilters.find((f) => f.id === dietaryFilter)?.[locale === 'en' ? 'labelEn' : 'labelDe']}</span>
                        <button type="button" onClick={() => setDietaryFilter('all')} className="hover:text-napoli-red">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}

                    {searchQuery && (
                      <span className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full text-[11px] font-semibold text-stone-700 dark:text-stone-300">
                        <span>&quot;{searchQuery}&quot;</span>
                        <button type="button" onClick={() => setSearchQuery('')} className="hover:text-napoli-red">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* ============================================================ */}
            {/* PRODUCT CARDS GRID: 2 columns on mobile, Picture 2 style      */}
            {/* ============================================================ */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {filteredItems.map((item) => {
                  const isAdded = addedItemId === item.id;
                  const isFav = isMounted && favoriteIds.includes(item.id);
                  const isDop = (item.name + ' ' + item.ingredients).toLowerCase().includes('d.o.p');
                  const categoryName =
                    categories.find((c) => c.slug === item.categorySlug)?.[locale === 'en' ? 'labelEn' : 'labelDe'] ||
                    item.categorySlug.replace(/-/g, ' ');

                  return (
                    <div
                      key={item.id}
                      className="group bg-white dark:bg-[#18120E] rounded-2xl sm:rounded-3xl border border-stone-200/80 dark:border-stone-800/90 shadow-xs hover:shadow-xl hover:border-napoli-red/40 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Product Image Header with Badges & Favorite Button */}
                      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-stone-100 dark:bg-stone-900 overflow-hidden">
                        <Link href={`/menu/${item.slug}`} className="block w-full h-full">
                          <Image
                            src={item.imageSrc || '/images/pizza-margherita.jpg'}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-106 transition-transform duration-500"
                            sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </Link>

                        {/* Top-Left Quality Badge */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                          {isDop ? (
                            <span className="bg-napoli-red text-white text-[8.5px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                              D.O.P.
                            </span>
                          ) : (
                            <span className="bg-white/95 dark:bg-stone-900/95 text-stone-900 dark:text-white text-[8.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                              Original
                            </span>
                          )}
                        </div>

                        {/* Top-Right Favorite Heart Icon */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(item.id)}
                          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                          aria-label={`Mark ${item.name} as favorite`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                              isFav ? 'fill-napoli-red text-napoli-red' : 'text-stone-400 hover:text-napoli-red'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Card Content: Picture 2 Style */}
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          {/* Brand / Category Line */}
                          <span className="text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 truncate block">
                            Little Napoli • {categoryName}
                          </span>

                          {/* Title */}
                          <Link href={`/menu/${item.slug}`}>
                            <h3 className="font-poppins text-xs sm:text-sm md:text-base font-bold text-stone-900 dark:text-white leading-tight group-hover:text-napoli-red dark:group-hover:text-red-400 transition-colors line-clamp-1">
                              {item.name}
                            </h3>
                          </Link>

                          {/* Rating Row (Picture 2 style) */}
                          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-stone-500 dark:text-stone-400 pt-0.5">
                            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                            <span className="font-bold text-stone-800 dark:text-stone-200">4.9</span>
                            <span className="text-stone-400 dark:text-stone-500">({24 + (item.id % 20) * 5})</span>
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
                            title={isAdded ? (locale === 'en' ? 'Added' : 'Im Korb') : (locale === 'en' ? 'Order' : 'In den Korb')}
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
            ) : (
              /* Empty State */
              <div className="text-center py-20 bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 rounded-3xl p-8 space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                  {dietaryFilter === 'favorites' ? (
                    <Heart className="w-6 h-6 text-napoli-red fill-napoli-red/20" />
                  ) : (
                    <Search className="w-6 h-6" />
                  )}
                </div>
                <h3 className="font-poppins text-xl font-bold text-stone-900 dark:text-white">
                  {dietaryFilter === 'favorites'
                    ? (locale === 'en' ? 'No favorites saved yet' : 'Noch keine Favoriten gespeichert')
                    : (locale === 'en' ? 'No dishes match your filter' : 'Keine Spezialitäten gefunden')}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto">
                  {dietaryFilter === 'favorites'
                    ? (locale === 'en'
                        ? 'Click the heart icon on any pizza or dish to save it in your favorites!'
                        : 'Klicke auf das Herz-Symbol bei einer Pizza oder einem Gericht, um es in deinen Favoriten zu speichern!')
                    : (locale === 'en'
                        ? 'Try resetting the price range, category, or search query to explore our complete menu.'
                        : 'Versuchen Sie, den Preisfilter oder die Suchbegriffe zurückzusetzen, um alle Gerichte zu sehen.')}
                </p>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="gap-2 rounded-xl text-xs font-bold border-stone-300 dark:border-stone-700 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-napoli-red" />
                  <span>{locale === 'en' ? 'Reset All Filters' : 'Filter zurücksetzen'}</span>
                </Button>
              </div>
            )}

          </main>

        </div>

      </div>
    </section>
  );
}

export function MenuGrid(props: MenuGridProps) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-stone-500">Speisekarte wird geladen...</div>}>
      <MenuGridInner {...props} />
    </Suspense>
  );
}

