# Little Napoli: Enterprise Architecture Overview

## 1. Executive Summary
**Little Napoli** is an enterprise-grade digital ecosystem designed for Pizzeria Little Napoli located at Hauptstraße 44, 2325 Himberg bei Wien, Austria. The platform combines an authentic culinary experience with cutting-edge 3D WebGL technology, high-throughput Laravel transactional processing, and search optimization tailored for Lower Austria and Vienna.

---

## 2. Decoupled Tier Architecture

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             CLIENT PRESENTATION TIER                             │
│                  apps/frontend-nextjs (Next.js 15, React 19, R3F)                │
│                                                                                  │
│  - App Router with localized routes (/de-AT/menu, /en/menu)                      │
│  - React Three Fiber 3D Canvas (Procedural charred crust, dynamic raycasting)    │
│  - Zustand persistent cart synchronized with localStorage and backend sessions   │
│  - Server Component rendering (RSC) for instantaneous SEO and JSON-LD markup     │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                                          │ JSON REST API / HTTPS / WSS
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            API & APPLICATION SERVICE TIER                        │
│             apps/backend-laravel (Laravel 11, Filament Admin, PHP 8.3)           │
│                                                                                  │
│  - Service-Repository Layer (Menu, Orders, Table Allocations, Taxes)             │
│  - Form Request Validation (Austrian phone & postcode regex rules)               │
│  - Austrian Dual-Tier VAT Calculation (10% Food, 20% Beverage UStG)              │
│  - Stripe Payment Intent creation & idempotent webhook verification              │
│  - Pessimistic table locking to eliminate reservation double-bookings            │
│  - ESC/POS 80mm thermal receipt generator for kitchen ticket printers            │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
┌──────────────────────────────────────────────┐ ┌─────────────────────────────────┐
│              PERSISTENCE TIER                │ │        INTEGRATIONS TIER        │
│                                              │ │                                 │
│  - PostgreSQL 16 Relational Database         │ │  - Stripe Payments (Apple Pay)  │
│    (With Codex Allergens A-R, B-tree indexes)│ │  - Resend Transactional Emails  │
│  - Redis In-Memory Cache                     │ │  - Cloudflare Turnstile Bot Def │
│    (Menu caching, rate limiting, queues)     │ │  - Google Business & Maps Deep  │
└──────────────────────────────────────────────┘ └─────────────────────────────────┘
```

---

## 3. Technology Matrix

| Layer | Primary Technologies | Key Standards |
|---|---|---|
| **Frontend Web** | Next.js 15, React 19, Tailwind CSS, Framer Motion | WCAG 2.1 AA, Zero CLS, Core Web Vitals (LCP < 1.2s) |
| **3D Graphics** | Three.js, React Three Fiber, Drei, Custom GLSL | 60 FPS mobile, Draco <1.2MB, automatic WebGL disposal |
| **Backend API** | Laravel 11, PHP 8.3, Laravel Sanctum, Spatie RBAC | Service-Repository, RFC 7807 JSON errors |
| **Database** | PostgreSQL 16, Eloquent ORM, Redis | ACID Transactions, Pessimistic Locking, Soft Deletes |
| **Local SEO** | Schema.org JSON-LD, `next-intl`, `@vercel/og` | NAP consistency, Austrian Geo-coordinates, hreflang |
| **Fiscal / Legal** | Austrian UStG, §5 ECG, §25 Mediengesetz, DSGVO | 10%/20% VAT split, Impressum, Consent Banner |
