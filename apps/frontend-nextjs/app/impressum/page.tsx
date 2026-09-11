import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Impressum | Little Napoli Himberg bei Wien',
  description: 'Gesetzliche Anbieterkennzeichnung nach § 5 E-Commerce-Gesetz (ECG) und § 25 Mediengesetz.',
};

export default function ImpressumPage() {
  return (
    <div className="py-16 bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] min-h-screen transition-colors duration-300">
      <div className="container px-4 md:px-8 max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <Badge variant="outline" className="text-napoli-red border-napoli-red/30">
            Rechtliche Angaben
          </Badge>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
            Impressum & Offenlegung
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Gemäß § 5 E-Commerce-Gesetz (ECG), § 14 Unternehmensgesetzbuch (UGB) und § 25 Mediengesetz.
          </p>
        </div>

        <Card className="bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-poppins text-stone-900 dark:text-white">
              Betreiber der Website & Medieninhaber
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            <div>
              <strong className="text-foreground block">Unternehmensbezeichnung:</strong>
              Pizzeria Little Napoli – L'Autentica Pizza Napoletana
            </div>

            <div>
              <strong className="text-foreground block">Standort der Gewerbeberechtigung:</strong>
              Hauptstraße 44<br />
              2325 Himberg bei Wien<br />
              Österreich / Niederösterreich
            </div>

            <div>
              <strong className="text-foreground block">Kontaktdaten:</strong>
              Telefon: <a href="tel:+43223542733" className="text-napoli-red hover:underline font-mono">+43 2235 42733</a><br />
              E-Mail: <a href="mailto:info@littlenapoli.at" className="text-napoli-red hover:underline">info@littlenapoli.at</a><br />
              Web: <a href="https://littlenapoli.at" className="text-napoli-red hover:underline">https://littlenapoli.at</a>
            </div>

            <div>
              <strong className="text-foreground block">Zuständige Kammer & Berufsverband:</strong>
              Wirtschaftskammer Niederösterreich (WKNÖ)<br />
              Fachgruppe: Gastronomie
            </div>

            <div>
              <strong className="text-foreground block">Anwendbare Rechtsvorschriften:</strong>
              Gewerbeordnung 1994 (GewO), abrufbar unter: <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener noreferrer" className="text-napoli-red hover:underline">www.ris.bka.gv.at</a>
            </div>

            <div>
              <strong className="text-foreground block">Aufsichtsbehörde:</strong>
              Bezirkshauptmannschaft Bruck an der Leitha
            </div>

            <div>
              <strong className="text-foreground block">Unternehmensgegenstand:</strong>
              Betrieb eines Gastronomieunternehmens, Zubereitung und Ausschank von Speisen und Getränken sowie Lieferservice und Takeaway.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
