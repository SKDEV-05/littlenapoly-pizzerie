'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const PizzaCanvasContainer = dynamic(
  () => import('@/components/canvas/PizzaCanvasContainer').then((m) => m.PizzaCanvasContainer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[520px] rounded-3xl bg-napoli-cream/40 border border-border flex items-center justify-center animate-pulse">
        <span className="text-sm font-poppins text-napoli-char">3D Holzofen-Pizza wird geladen...</span>
      </div>
    ),
  }
);

export function MenuHero3D() {
  return <PizzaCanvasContainer />;
}
