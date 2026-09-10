# Little Napoli: Architectural Decision Records (ADRs) & Benchmarks

This document records the architectural decisions, trade-offs, and technical benchmarks across the Little Napoli ecosystem.

---

## ADR-001: Decoupled Monorepo Architecture (Laravel + Next.js 15)
- **Status:** Accepted
- **Context:** Pizzeria Little Napoli requires a high-performance, SEO-dominant public web presence with 3D WebGL visuals, alongside an administration and transactional engine (POS printing, SMS dispatch, table reservation conflict resolution).
- **Decision:** Separate backend (`apps/backend-laravel/`) using Laravel 11 + Filament Admin + PostgreSQL + Redis from the frontend (`apps/frontend-nextjs/`) using Next.js 15 App Router + React 19 + Three.js.
- **Consequences:** 
  - Complete isolation between administrative heavy processing and client web performance.
  - Next.js handles server-rendered SEO and instant edge caching.
  - Laravel ensures ACID transactional safety on bookings and Austrian tax compliance.

---

## ADR-002: 3D Graphics Engine & Draco Asset Compression
- **Status:** Accepted
- **Context:** Neapolitan pizza requires sensory visual representation (charred *cornicione*, rising steam, shiny DOP mozzarella). Loading heavy uncompressed 3D models (>10MB) would destroy Core Web Vitals (LCP/INP).
- **Decision:** Use `@react-three/fiber` and `@react-three/drei` with Draco-compressed `.glb` assets (<1.2MB), procedural GLSL shaders for charred spots, instanced GPU steam particles, dynamic DPR clamping `[1, 2]`, and dynamic import `{ ssr: false }`.
- **Benchmark Target:** 60 FPS on mid-tier mobile (iPhone 12 / Snapdragon 778G), WebGL VRAM footprint < 45MB with automated disposal on route navigation.

---

## ADR-003: Austrian Fiscal Engine (Dual-Tier VAT 10% / 20%)
- **Status:** Accepted
- **Context:** Austrian fiscal law (UStG) requires itemized breakdown: 10% food VAT vs 20% beverage VAT on every checkout and printed POS receipt.
- **Decision:** Encapsulate tax splitting inside a dedicated backend `TaxCalculationService` tested with 100% Pest unit coverage. Pricing displayed to customers is always gross (tax-inclusive), with net and tax portions computed deterministically.

---

## ADR-004: Table Reservation Concurrency & Anti-Collision
- **Status:** Accepted
- **Context:** Peak dining hours (Friday–Sunday 18:00–21:00) risk simultaneous double bookings for limited restaurant tables.
- **Decision:** Implement database pessimistic locking (`lockForUpdate()`) within a database transaction during table reservation allocation. Cloudflare Turnstile token validation prevents bot reservation spam.

---

## ADR-005: Local SEO & Austrian Search Performance
- **Status:** Accepted
- **Context:** High competition in Lower Austria / Vienna south area for authentic Neapolitan pizza.
- **Decision:** Embed complete Schema.org `Restaurant` and `Menu` JSON-LD with exact coordinates (`48.0772, 16.4447`), next-intl `de-AT` German localization as primary, automated XML sitemaps with alternate hreflang tags, and geo-targeted meta headers for Himberg, Mödling, and Schwechat.
- **Benchmark Target:** Google Lighthouse Performance >= 95, Accessibility = 100, SEO = 100.
