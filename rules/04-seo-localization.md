# Rule 04: Local SEO, Internationalization & Structured Data

## 1. Scope & Applicable Skills
This rule enforces strict Austrian search engine optimization and localization standards for **Skills 051–060**.

- **Skill 051:** Valid Schema.org `Restaurant` JSON-LD with exact geo-coordinates.
- **Skill 052:** Dynamic Schema.org `Menu` and `MenuItem` markup synced with Laravel.
- **Skill 053:** Bilingual internationalization via `next-intl` (`de-AT` primary, `en` secondary).
- **Skill 054:** Dynamic OpenGraph image generation via `@vercel/og`.
- **Skill 055:** Localized XML sitemaps with absolute canonicals and alternate hreflang tags.
- **Skill 056:** Dynamic `robots.txt` generation.
- **Skill 057:** Hyper-local Austrian meta-targeting (Himberg, Mödling, Schwechat, Wien).
- **Skill 058:** Automated `BreadcrumbList` schema generation.
- **Skill 059:** Core Web Vitals optimization (LCP < 1.2s, INP < 100ms, CLS = 0).
- **Skill 060:** Google Business Profile citation consistency and review redirect intent.

---

## 2. Business Ground Truth for Schema.org

All structured data must be strictly synchronized with Little Napoli's official physical details:

```typescript
export const BUSINESS_NAP = {
  name: "Little Napoli - L'Autentica Pizza Napoletana",
  legalName: "Pizzeria Little Napoli",
  address: {
    streetAddress: "Hauptstraße 44",
    addressLocality: "Himberg bei Wien",
    postalCode: "2325",
    addressRegion: "Niederösterreich",
    addressCountry: "AT",
  },
  geo: {
    latitude: 48.0772,
    longitude: 16.4447,
  },
  telephone: "+43223542733",
  displayPhone: "+43 2235 42733",
  priceRange: "€€",
  servesCuisine: ["Neapolitan Pizza", "Italian", "Pasta", "Mediterranean"],
  url: "https://littlenapoli.at",
  openingHours: [
    "Tu-Su 11:00-22:00"
  ],
  currenciesAccepted: "EUR",
  paymentAccepted: "Cash, Credit Card, Apple Pay, Google Pay",
};
```

---

## 3. SEO Implementation Rules

### A. Restaurant JSON-LD Injection (`components/seo/RestaurantJsonLd.tsx`)
Rendered directly inside `<head>` of `app/[locale]/layout.tsx`:

```tsx
export function RestaurantJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": "https://littlenapoli.at/#restaurant",
    "name": BUSINESS_NAP.name,
    "image": [
      "https://littlenapoli.at/images/restaurant-facade.webp",
      "https://littlenapoli.at/images/pizza-margherita-dop.webp"
    ],
    "telephone": BUSINESS_NAP.telephone,
    "url": BUSINESS_NAP.url,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BUSINESS_NAP.address.streetAddress,
      "addressLocality": BUSINESS_NAP.address.addressLocality,
      "postalCode": BUSINESS_NAP.address.postalCode,
      "addressRegion": BUSINESS_NAP.address.addressRegion,
      "addressCountry": BUSINESS_NAP.address.addressCountry,
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": BUSINESS_NAP.geo.latitude,
      "longitude": BUSINESS_NAP.geo.longitude,
    },
    "servesCuisine": BUSINESS_NAP.servesCuisine,
    "priceRange": BUSINESS_NAP.priceRange,
    "hasMenu": "https://littlenapoli.at/de-AT/menu",
    "acceptsReservations": "True",
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://littlenapoli.at/de-AT/reservierung",
        "inLanguage": "de-AT",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      },
      "result": {
        "@type": "FoodEstablishmentReservation",
        "name": "Tischreservierung Little Napoli"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

### B. Austrian Geo-Targeting Metadata
Every localized route must output Austrian geographic meta tags:

```typescript
export const metadata: Metadata = {
  other: {
    'geo.region': 'AT-3',
    'geo.placename': 'Himberg',
    'geo.position': '48.0772;16.4447',
    'ICBM': '48.0772, 16.4447',
  },
};
```
