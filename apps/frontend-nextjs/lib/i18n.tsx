'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 'de' | 'en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const translations: Record<Locale, Record<string, string>> = {
  de: {
    // Nav
    'nav.menu': 'Speisekarte',
    'nav.reservation': 'Tischreservierung',
    'nav.cart': 'Warenkorb',
    'nav.call': '+43 2235 42733',

    // Hero
    'hero.greeting': 'Ciao!',
    'hero.title': 'Little Napoli',
    'hero.tagline': "L'Autentica Pizza Napoletana",
    'hero.description':
      'Frisch gebacken, herrlich käsig und voller Geschmack — jedes Stück von Little Napoli ist ein kleines Stück Glück. Erleben Sie die perfekte Harmonie aus 48 Stunden Teigfermentation, 485°C Holzofenhitze und echter italienischer Leidenschaft in jedem Bissen!',
    'hero.ovenBadge': '485°C Holzofen',
    'hero.doughBadge': '48h Teigfermentation',
    'hero.allergens': 'Allergene:',
    'hero.taxNotice': 'inkl. 10% USt',
    'hero.addToCart': 'In den Warenkorb',
    'hero.addedToCart': 'In den Warenkorb gelegt!',
    'hero.viewDetails': 'Details ansehen',

    // Menu section
    'menu.title': 'Unsere Spezialitäten',
    'menu.subtitle': 'Traditionelle Holzofenpizzen, hausgemachte Pasta & italienische Dolci nach Originalrezepten aus Neapel.',
    'menu.searchPlaceholder': 'Zutat oder Gericht suchen (z.B. Fior di Latte, Basilikum, Salami)...',
    'menu.priceFilter': 'Preisfilter:',
    'menu.allPrices': 'Alle Preise',
    'menu.under10': 'Unter €10',
    'menu.between10and15': '€10 – €15',
    'menu.over15': 'Über €15',
    'menu.allCategories': 'Alle Gerichte',
    'menu.classiche': 'Pizze Classiche',
    'menu.gialle': 'Pizze Gialle',
    'menu.bianche': 'Bianche & Calzone',
    'menu.antipasti': 'Antipasti & Salate',
    'menu.pasta': 'Hausgemachte Pasta',
    'menu.dolci': 'Dolci Artigianali',
    'menu.drinks': 'Getränke & Bier',
    'menu.specialtiesCount': 'Spezialitäten',
    'menu.resetFilters': 'Filter zurücksetzen',
    'menu.noResults': 'Keine Spezialitäten gefunden für die gewählten Filter.',
    'menu.servingSize': 'Portionsgröße:',
    'menu.addToCart': 'In den Warenkorb',
    'menu.added': 'Hinzugefügt!',

    // Reservation CTA
    'cta.reservationTitle': 'Möchten Sie einen Tisch reservieren?',
    'cta.reservationDesc':
      'Genießen Sie ofenfrische Holzofenpizza direkt bei uns in der Hauptstraße 44, 2325 Himberg. Reservieren Sie bequem online oder rufen Sie uns direkt an.',
    'cta.bookOnline': 'Online Tisch Reservieren',
    'cta.callDirect': '+43 2235 42733',

    // Reservation Page
    'res.badge': 'Tischreservierung • Sofortige Bestätigung',
    'res.title': 'Reservieren Sie Ihren Tisch',
    'res.subtitle': 'Pizzeria Little Napoli, Hauptstraße 44, 2325 Himberg bei Wien • Holzofenpizza bei 485°C',
    'res.formTitle': 'Reservierungsdaten eingeben',
    'res.formDesc': 'Bitte füllen Sie das Formular aus. Ihre Bestätigung erfolgt sofort online.',
    'res.name': 'Vollständiger Name',
    'res.namePlaceholder': 'z.B. Maximilian Mustermann',
    'res.email': 'E-Mail-Adresse',
    'res.emailPlaceholder': 'beispiel@domain.at',
    'res.phone': 'Telefonnummer (Österreich)',
    'res.phonePlaceholder': '+43 676 1234567',
    'res.partySize': 'Anzahl Personen',
    'res.date': 'Datum',
    'res.time': 'Uhrzeit (11:00 – 21:45)',
    'res.specialRequests': 'Besondere Wünsche / Anmerkungen (Optional)',
    'res.specialRequestsPlaceholder': 'z.B. Kinderstuhl benötigt, ruhiger Tisch im Innenbereich',
    'res.submit': 'Jetzt verbindlich reservieren',
    'res.submitting': 'Reservierung wird geprüft...',
    'res.successTitle': 'Tisch erfolgreich reserviert!',
    'res.code': 'Reservierungs-Code:',
    'res.dateLabel': 'Datum:',
    'res.timeLabel': 'Uhrzeit:',
    'res.tableLabel': 'Tischnummer:',
    'res.another': 'Weitere Reservierung anfragen',

    // Auth & Checkout Gate
    'auth.signIn': 'Anmelden',
    'auth.signUp': 'Konto erstellen',
    'auth.email': 'E-Mail-Adresse',
    'auth.password': 'Passwort',
    'auth.name': 'Vollständiger Name',
    'auth.phone': 'Telefonnummer (Österreich)',
    'auth.logout': 'Abmelden',
    'auth.demoAdmin': 'Als Admin anmelden',
    'auth.demoCustomer': 'Als Kunde anmelden',
    'auth.checkoutGateTitle': 'Vor der Bestellung anmelden',
    'auth.checkoutGateDesc': 'Bitte melden Sie sich an oder erstellen Sie ein kostenloses Kundenkonto, um Ihre Bestellung abzuschließen.',

    // Admin Panel
    'admin.title': 'Little Napoli • Restaurant Verwaltung',
    'admin.overview': 'Übersicht & KPI',
    'admin.orders': 'Live-Bestellungen',
    'admin.reservations': 'Tischreservierungen',
    'admin.menu': 'Speisekarte & Produkte',
    'admin.users': 'Kunden & Accounts',
    'admin.totalRevenue': 'Gesamtumsatz',
    'admin.todayOrders': 'Bestellungen',
    'admin.pendingOrders': 'Offene Bestellungen',
    'admin.confirmedRes': 'Bestätigte Tische',
    'admin.statusNew': 'Neu',
    'admin.statusPreparing': 'In Zubereitung',
    'admin.statusReady': 'Abholbereit',
    'admin.statusCompleted': 'Abgeschlossen',
    'admin.statusCancelled': 'Storniert',
  },
  en: {
    // Nav
    'nav.menu': 'Menu',
    'nav.reservation': 'Table Reservation',
    'nav.cart': 'Cart',
    'nav.call': '+43 2235 42733',

    // Hero
    'hero.greeting': 'Ciao!',
    'hero.title': 'Little Napoli',
    'hero.tagline': 'The Authentic Neapolitan Pizza',
    'hero.description':
      'Freshly baked, cheesy, and bursting with flavor — every slice of Little Napoli is a little piece of happiness. Taste the perfect blend of 48-hour fermented dough, 485°C wood-fired heat, and authentic Italian love in every bite!',
    'hero.ovenBadge': '485°C Wood-Fired Oven',
    'hero.doughBadge': '48h Dough Fermentation',
    'hero.allergens': 'Allergens:',
    'hero.taxNotice': 'incl. 10% VAT',
    'hero.addToCart': 'Add to Cart',
    'hero.addedToCart': 'Added to Cart!',
    'hero.viewDetails': 'View Details',

    // Menu section
    'menu.title': 'Our Specialties',
    'menu.subtitle': 'Traditional wood-fired pizzas, handmade pasta & artisan dolci crafted according to original Neapolitan traditions.',
    'menu.searchPlaceholder': 'Search ingredient or dish (e.g. Fior di Latte, Basil, Salami)...',
    'menu.priceFilter': 'Price Filter:',
    'menu.allPrices': 'All Prices',
    'menu.under10': 'Under €10',
    'menu.between10and15': '€10 – €15',
    'menu.over15': 'Over €15',
    'menu.allCategories': 'All Dishes',
    'menu.classiche': 'Classic Pizzas',
    'menu.gialle': 'Yellow Tomato Pizzas',
    'menu.bianche': 'White Pizzas & Calzone',
    'menu.antipasti': 'Antipasti & Salads',
    'menu.pasta': 'Fresh Homemade Pasta',
    'menu.dolci': 'Artisan Desserts',
    'menu.drinks': 'Drinks & Beer',
    'menu.specialtiesCount': 'Specialties',
    'menu.resetFilters': 'Reset Filters',
    'menu.noResults': 'No dishes found matching your current filters.',
    'menu.servingSize': 'Serving size:',
    'menu.addToCart': 'Add to Cart',
    'menu.added': 'Added!',

    // Reservation CTA
    'cta.reservationTitle': 'Would you like to book a table?',
    'cta.reservationDesc':
      'Enjoy oven-fresh Neapolitan pizza directly with us at Hauptstraße 44, 2325 Himberg near Vienna. Reserve conveniently online or give us a call.',
    'cta.bookOnline': 'Book Table Online',
    'cta.callDirect': '+43 2235 42733',

    // Reservation Page
    'res.badge': 'Table Reservation • Instant Confirmation',
    'res.title': 'Reserve Your Table',
    'res.subtitle': 'Pizzeria Little Napoli, Hauptstraße 44, 2325 Himberg near Vienna • 485°C Wood-fired Oven',
    'res.formTitle': 'Enter Reservation Details',
    'res.formDesc': 'Please fill out the form below. Confirmation is instant.',
    'res.name': 'Full Name',
    'res.namePlaceholder': 'e.g. John Doe',
    'res.email': 'Email Address',
    'res.emailPlaceholder': 'example@domain.com',
    'res.phone': 'Phone Number',
    'res.phonePlaceholder': '+43 676 1234567',
    'res.partySize': 'Number of Guests',
    'res.date': 'Date',
    'res.time': 'Time (11:00 AM – 9:45 PM)',
    'res.specialRequests': 'Special Requests / Notes (Optional)',
    'res.specialRequestsPlaceholder': 'e.g. Highchair needed, quiet table inside',
    'res.submit': 'Confirm Reservation Now',
    'res.submitting': 'Checking reservation...',
    'res.successTitle': 'Table Successfully Reserved!',
    'res.code': 'Reservation Code:',
    'res.dateLabel': 'Date:',
    'res.timeLabel': 'Time:',
    'res.tableLabel': 'Table Number:',
    'res.another': 'Request Another Reservation',

    // Auth & Checkout Gate
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Create Account',
    'auth.email': 'Email Address',
    'auth.password': 'Password',
    'auth.name': 'Full Name',
    'auth.phone': 'Phone Number',
    'auth.logout': 'Sign Out',
    'auth.demoAdmin': 'Sign in as Admin',
    'auth.demoCustomer': 'Sign in as Customer',
    'auth.checkoutGateTitle': 'Sign in before Checkout',
    'auth.checkoutGateDesc': 'Please sign in or create a customer account to proceed with your pickup order.',

    // Admin Panel
    'admin.title': 'Little Napoli • Restaurant Administration',
    'admin.overview': 'Overview & KPI',
    'admin.orders': 'Live Orders',
    'admin.reservations': 'Table Reservations',
    'admin.menu': 'Menu & Products',
    'admin.users': 'Customers & Users',
    'admin.totalRevenue': 'Total Revenue',
    'admin.todayOrders': 'Orders',
    'admin.pendingOrders': 'Pending Orders',
    'admin.confirmedRes': 'Confirmed Tables',
    'admin.statusNew': 'New',
    'admin.statusPreparing': 'Preparing',
    'admin.statusReady': 'Ready for Pickup',
    'admin.statusCompleted': 'Completed',
    'admin.statusCancelled': 'Cancelled',
  },
};

const I18nContext = createContext<I18nContextType>({
  locale: 'de',
  setLocale: () => {},
  toggleLocale: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('littlenapoli_locale') as Locale;
      if (saved === 'de' || saved === 'en') {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('littlenapoli_locale', newLocale);
    } catch {
      // ignore
    }
  };

  const toggleLocale = () => {
    const next = locale === 'de' ? 'en' : 'de';
    setLocale(next);
  };

  const t = (key: string): string => {
    return translations[locale]?.[key] || translations['de']?.[key] || key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, toggleLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
