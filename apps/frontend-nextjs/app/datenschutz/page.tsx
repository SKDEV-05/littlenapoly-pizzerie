import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Datenschutzerklärung | Little Napoli Himberg bei Wien',
  description: 'Datenschutzerklärung gemäß Datenschutz-Grundverordnung (DSGVO) und österreichischem Datenschutzgesetz (DSG).',
};

export default function DatenschutzPage() {
  return (
    <div className="py-16 bg-gradient-to-b from-[#FBF0DF] via-stone-50 to-[#F5ECE1] dark:from-[#110D0A] dark:via-[#16120F] dark:to-[#0C0908] min-h-screen transition-colors duration-300">
      <div className="container px-4 md:px-8 max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <Badge variant="outline" className="text-napoli-red border-napoli-red/30">
            Datenschutz & DSGVO
          </Badge>
          <h1 className="font-poppins text-3xl sm:text-4xl font-extrabold text-stone-900 dark:text-white">
            Datenschutzerklärung
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Information über die Verarbeitung personenbezogener Daten bei der Nutzung unserer Website, Online-Bestellungen und Tischreservierungen.
          </p>
        </div>

        <Card className="bg-white dark:bg-[#1A1411] border border-stone-200 dark:border-stone-800 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold font-poppins text-stone-900 dark:text-white">1. Verantwortlicher</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
            <p>
              Verantwortlicher im Sinne der EU-Datenschutz-Grundverordnung (DSGVO) ist:
            </p>
            <div>
              <strong className="text-foreground block">Pizzeria Little Napoli</strong>
              Hauptstraße 44, 2325 Himberg bei Wien, Österreich<br />
              Telefon: +43 2235 42733<br />
              E-Mail: datenschutz@littlenapoli.at
            </div>

            <h3 className="font-bold text-base text-foreground pt-4">2. Datenverarbeitung bei Online-Bestellungen & Reservierungen</h3>
            <p>
              Wenn Sie über unsere Website Speisen zur Abholung bestellen oder einen Tisch reservieren, verarbeiten wir die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Telefonnummer, Datum/Uhrzeit sowie allfällige Anmerkungen) zur Erfüllung des Vertrages bzw. zur Durchführung vorvertraglicher Maßnahmen gemäß Art. 6 Abs. 1 lit. b DSGVO.
            </p>

            <h3 className="font-bold text-base text-foreground pt-4">3. Bereitstellung von 3D-Inhalten (WebGL)</h3>
            <p>
              Unsere interaktive 3D-Pizzavisualisierung wird lokal in Ihrem Browser über WebGL gerendert. Es werden hierbei keinerlei personenbezogene Daten an Dritte übermittelt.
            </p>

            <h3 className="font-bold text-base text-foreground pt-4">4. Ihre Rechte als betroffene Person</h3>
            <p>
              Ihnen stehen gemäß DSGVO die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch zu. Bei Beschwerden können Sie sich an die österreichische Datenschutzbehörde (Barichgasse 40-42, 1030 Wien, E-Mail: dsb@dsb.gv.at) wenden.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
