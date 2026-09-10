# Rule 02: Next.js 15 & React 19 Client Engine

## 1. Scope & Applicable Skills
This rule enforces enterprise standards for **Skills 021–030** within `apps/frontend-nextjs/`.

- **Skill 021:** Next.js 15 App Router decoupled from Laravel.
- **Skill 022:** Server-side rendering (SSR) with revalidation tags (`revalidateTag`).
- **Skill 023:** React 19 Actions and optimistic mutation states.
- **Skill 024:** Parallel and intercepting modal routing (`@modal`).
- **Skill 025:** Dynamic SEO routes (`/menu/[category]/[slug]`).
- **Skill 026:** Zero-layout-shift font loading via `next/font`.
- **Skill 027:** Next.js image optimization pipeline generating AVIF/WebP.
- **Skill 028:** Hydration error isolation with dynamic imports (`ssr: false`).
- **Skill 029:** Edge Middleware for locale resolution (`de-AT` vs `en`).
- **Skill 030:** Accessible global error boundaries and offline fallbacks.

---

## 2. Directory & Route Hierarchy

```text
apps/frontend-nextjs/src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                # Root layout with fonts and metadata
│   │   ├── page.tsx                  # Home landing with 3D Hero section
│   │   ├── menu/
│   │   │   ├── page.tsx              # Full menu with allergen filter
│   │   │   └── [category]/
│   │   │       ├── page.tsx          # Category list (Classiche, Gialle, etc.)
│   │   │       └── [slug]/
│   │   │           └── page.tsx      # Dish detail with 3D visualizer
│   │   ├── @modal/
│   │   │   └── (.)menu/[category]/[slug]/
│   │   │       └── page.tsx          # Intercepting Quick-View modal
│   │   ├── reservierung/
│   │   │   └── page.tsx              # Table reservation flow
│   │   ├── checkout/
│   │   │   └── page.tsx              # Cart checkout & Stripe payment
│   │   ├── impressum/
│   │   │   └── page.tsx              # Austrian legal disclosure (§5 ECG)
│   │   └── datenschutz/
│   │       └── page.tsx              # GDPR / DSGVO privacy policy
│   ├── api/
│   │   ├── og/route.tsx              # Dynamic OpenGraph image generator
│   │   ├── revalidate/route.ts       # On-demand tag revalidation hook
│   │   └── health/route.ts           # Health probe endpoint
│   ├── layout.tsx
│   ├── sitemap.ts                    # Localized XML sitemaps
│   └── robots.ts                     # Dynamic robots.txt
├── actions/
│   ├── cart-actions.ts
│   ├── reservation-actions.ts
│   └── contact-actions.ts
├── components/
│   ├── 3d/
│   ├── menu/
│   ├── ui/
│   └── seo/
└── lib/
    ├── api/
    ├── fonts.ts
    └── i18n/
```

---

## 3. Implementation Directives

### A. Strict React Server Component (RSC) Boundaries
Page layouts, static text, and initial menu data MUST be rendered on the server. Interactive UI (3D canvas, cart store subscriber, allergen popover) MUST be isolated into leaf components marked with `"use client"`.

### B. Tag-Based Data Fetching & Revalidation
All menu queries fetching from the Laravel REST API must attach cache tags:

```typescript
export async function getMenuCategories(locale: string = 'de-AT') {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, {
    headers: {
      'Accept-Language': locale,
      'Accept': 'application/json',
    },
    next: {
      tags: ['menu-categories', 'menu'],
      revalidate: 3600, // 1 hour background ISR
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch menu categories: ${res.statusText}`);
  }

  return res.json();
}
```

### C. Zero-CLS Typography
Headings use `Playfair Display` (warm Italian typography) and body uses `Inter`:

```typescript
import { Playfair_Display, Inter } from 'next/font/google';

export const fontPlayfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```
