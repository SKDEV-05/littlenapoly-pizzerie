import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { HeaderNav } from '@/components/ui/HeaderNav';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Clock, Instagram, ExternalLink } from 'lucide-react';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Little Napoli - L'Autentica Pizza Napoletana in Himberg bei Wien",
  description:
    'Echte neapolitanische Holzofenpizza, Pizze Gialle mit gelber Datteltomatensauce, hausgemachte Pasta und Dolci in Hauptstraße 44, 2325 Himberg bei Wien.',
  keywords: [
    'Pizza Napoletana',
    'Pizzeria Himberg',
    'Holzofenpizza',
    'San Marzano D.O.P.',
    'Pizze Gialle',
    'Himberg bei Wien',
    'Pizzeria Niederösterreich',
    'Little Napoli',
  ],
  authors: [{ name: 'Little Napoli' }],
  metadataBase: new URL('https://littlenapoli.at'),
  openGraph: {
    title: "Little Napoli - L'Autentica Pizza Napoletana",
    description:
      'Traditionelle 48h Teigfermentation, 485°C Holzofen und authentische Zutaten aus Kampanien.',
    url: 'https://littlenapoli.at',
    siteName: 'Little Napoli',
    locale: 'de_AT',
    type: 'website',
  },
  other: {
    'geo.region': 'AT-3',
    'geo.placename': 'Himberg',
    'geo.position': '48.0772;16.4447',
    ICBM: '48.0772, 16.4447',
  },
};

import { I18nProvider } from '@/lib/i18n';
import { ThemeProvider } from '@/lib/theme';
import { FooterLocationMap } from '@/components/sections/FooterLocationMap';
import { SiteFooter } from '@/components/ui/SiteFooter';
import { MenuBookModal } from '@/components/ui/MenuBookModal';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://littlenapoli.at/#restaurant',
    name: "Little Napoli - L'Autentica Pizza Napoletana",
    telephone: '+43223542733',
    url: 'https://littlenapoli.at',
    image: 'https://littlenapoli.at/images/pizza-margherita.webp',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Hauptstraße 44',
      addressLocality: 'Himberg bei Wien',
      postalCode: '2325',
      addressRegion: 'Niederösterreich',
      addressCountry: 'AT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 48.0772,
      longitude: 16.4447,
    },
    servesCuisine: ['Neapolitan Pizza', 'Italian', 'Pasta', 'Mediterranean'],
    priceRange: '€€',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '11:00',
        closes: '22:00',
      },
    ],
    hasMenu: 'https://littlenapoli.at/menu',
    acceptsReservations: 'True',
  };

  return (
    <html lang="de-AT" className={`${poppins.variable} ${playfair.variable} font-poppins`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-poppins antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <I18nProvider>
            <HeaderNav />
            <main className="flex-1">{children}</main>

            {/* Interactive Location Map Section with Framer Motion Left/Right Animations */}
            <FooterLocationMap />

            {/* Global Footer (hides on /admin) */}
            <SiteFooter />

            {/* Global Interactive Menu Book Flipbook Modal */}
            <MenuBookModal />
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
