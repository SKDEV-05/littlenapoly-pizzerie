# Little Napoli: Hyper-Local SEO & Schema.org Strategy

**Target Location:** Hauptstraße 44, 2325 Himberg bei Wien, Lower Austria (Niederösterreich), Austria  
**Primary Target Regions:** Himberg, Pellendorf, Maria Lanzendorf, Zwölfaxing, Schwechat, Mödling, Wien-Süd (Favoriten/Simmering).

---

## 1. NAP Consistency & Local Citations

- **Name:** Pizzeria Little Napoli
- **Address:** Hauptstraße 44, 2325 Himberg bei Wien, Österreich
- **Phone:** `+43 2235 42733`
- **Coordinates:** Latitude `48.0772`, Longitude `16.4447`
- **Google Maps CID & Place ID:** Linked dynamically across footer and reservation confirmations.

---

## 2. Schema.org JSON-LD Specifications

### A. Restaurant Root Schema (`components/seo/restaurant-jsonld.tsx`)
```json
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "@id": "https://littlenapoli.at/#restaurant",
  "name": "Pizzeria Little Napoli",
  "image": [
    "https://littlenapoli.at/images/restaurant-exterior.webp",
    "https://littlenapoli.at/images/pizza-margherita-dop.webp"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Hauptstraße 44",
    "addressLocality": "Himberg bei Wien",
    "postalCode": "2325",
    "addressRegion": "Niederösterreich",
    "addressCountry": "AT"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 48.0772,
    "longitude": 16.4447
  },
  "url": "https://littlenapoli.at",
  "telephone": "+43223542733",
  "servesCuisine": ["Italian", "Neapolitan Pizza", "Mediterranean"],
  "priceRange": "€€",
  "acceptsReservations": "True",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "11:00",
      "closes": "22:00"
    }
  ],
  "hasMenu": "https://littlenapoli.at/menu",
  "potentialAction": {
    "@type": "ReserveAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://littlenapoli.at/reservierung",
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
}
```

### B. Menu & MenuItem Schema
Each item on the `/menu` route dynamically embeds structured `Menu` and `MenuItem` data with prices in EUR, VAT included, and allergen attributes.

---

## 3. Core Web Vitals Targets

- **LCP (Largest Contentful Paint):** < 1.2 seconds (via server-rendered critical text, preloaded fonts, and high-priority WebP/AVIF hero assets).
- **INP (Interaction to Next Paint):** < 100 milliseconds (offloading 3D WebGL shader compilations and Raycaster physics to idle callbacks / Web Workers).
- **CLS (Cumulative Layout Shift):** 0.00 (reserved canvas aspect ratios and `next/font` size-adjust metric matching).
