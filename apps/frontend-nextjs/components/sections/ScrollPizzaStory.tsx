import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Flame, Wheat, HeartHandshake } from 'lucide-react';

export function ScrollPizzaStory() {
  const pillars = [
    {
      icon: <Wheat className="w-6 h-6 text-napoli-yellow" />,
      title: 'Caputo 00 & 48h Fermentation',
      description:
        'Unser Teig besteht ausschließlich aus feinstem Weizenmehl Typ 00, Wasser, Meersalz und Hefe. Nach 48 Stunden kühler Teigruhe entsteht ein bekömmlicher, luftig-leichter Boden.',
    },
    {
      icon: <Flame className="w-6 h-6 text-napoli-red" />,
      title: '485°C Wood-Fired Heat',
      description:
        'In nur 60 bis 90 Sekunden backt unsere Pizza bei fast 500 Grad. Dabei bildet sich das typische "Cornicione maculato" — der hohe Rand mit den charakteristischen Röstflecken.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-napoli-red" />,
      title: 'San Marzano & Datterino Giallo',
      description:
        'Wir verwenden handverlesene San Marzano D.O.P. Tomaten vom Fuße des Vesuvs und für unsere Pizze Gialle die süße, sonnige gelbe Datteltomatensauce aus Kampanien.',
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-napoli-green" />,
      title: 'Sorrento Fior di Latte & San Daniele',
      description:
        'Frischer Fior di Latte aus Sorrento, echter Büffelmozzarella D.O.P. aus Neapel und 24 Monate gereifter Prosciutto Crudo San Daniele D.O.P. krönen jede Spezialität.',
    },
  ];

  return (
    <section className="py-20 bg-napoli-cream/40 border-y border-border/60">
      <div className="container px-4 md:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-14">
          <Badge variant="outline" className="bg-white text-napoli-red border-napoli-red/30">
            Italienische Tradition
          </Badge>
          <h2 className="font-poppins text-3xl sm:text-4xl font-bold tracking-tight text-napoli-char">
            Das Geheimnis der wahren Pizza Napoletana
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Keine Kompromisse bei Zutaten und Zubereitung. Bei Little Napoli in Himberg schmecken Sie den Unterschied mit jedem Bissen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <Card key={idx} className="bg-white/90 border-border/70 hover:border-napoli-red/40">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-napoli-cream flex items-center justify-center shadow-inner">
                  {pillar.icon}
                </div>
                <h3 className="font-poppins font-bold text-lg text-napoli-char leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
