'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { MapPin, Phone, ArrowRight, Flame, Award, Clock } from 'lucide-react';

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

export function HeroSplitStage() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:py-24 bg-gradient-to-b from-napoli-cream/60 via-background to-background">
      <div className="container px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Narrative & Conversion */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="napoli" className="bg-napoli-red text-white gap-1 px-3 py-1">
                <Flame className="w-3.5 h-3.5 fill-white" />
                Original Neapolitanisch
              </Badge>
              <Badge variant="outline" className="gap-1 bg-white/90 border-border px-3 py-1">
                <MapPin className="w-3.5 h-3.5 text-napoli-red" />
                Hauptstraße 44, 2325 Himberg bei Wien
              </Badge>
            </div>

            <h1 className="font-poppins text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-napoli-char leading-[1.1]">
              L'Autentica <br />
              <span className="text-napoli-red underline decoration-napoli-yellow decoration-wavy decoration-2">
                Pizza Napoletana
              </span> <br />
              in Himberg bei Wien.
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Erleben Sie echte italienische Handwerkskunst: 48 Stunden schonend gereifter Teig,
              hochgezogener, zart-knusprig gefleckter Rand (<em>Cornicione</em>) und die besten
              Zutaten Kampaniens — direkt gebacken bei 485°C im traditionellen Holzofen.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/menu">
                <Button variant="napoli" size="lg" className="gap-2">
                  Speisekarte & Bestellen
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/reservation">
                <Button variant="outline" size="lg" className="gap-2 border-border/90 hover:bg-napoli-red/5">
                  Tisch Reservieren
                </Button>
              </Link>
            </div>

            {/* Quick Facts Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/70 text-center sm:text-left">
              <div>
                <span className="block font-bold text-lg text-napoli-char font-poppins">48 Std.</span>
                <span className="text-xs text-muted-foreground">Teigfermentation</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-napoli-char font-poppins">485 °C</span>
                <span className="text-xs text-muted-foreground">Holzofenhitze</span>
              </div>
              <div>
                <span className="block font-bold text-lg text-napoli-char font-poppins">D.O.P.</span>
                <span className="text-xs text-muted-foreground">Zertifiziert</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive WebGL Pizza Canvas */}
          <div className="lg:col-span-6">
            <PizzaCanvasContainer />
          </div>
        </div>
      </div>
    </section>
  );
}
