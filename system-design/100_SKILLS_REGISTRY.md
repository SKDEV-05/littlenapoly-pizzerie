# Little Napoli 100-Skill Enterprise Registry

This document serves as the master specification for all 100 capabilities embedded in the Little Napoli engineering ecosystem.

---

## Group 1: Core Next.js 15 & React 19 Architecture (Skills 1–10)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **01** | Next.js App Router Orchestration | Nested layout hierarchy, template transitions, parallel segments. | `app/layout.tsx`, `app/[locale]/layout.tsx` |
| **02** | React Server Component Isolation | Strict separation between server data-fetching and interactive client leaves. | `"use client"` boundary isolation, `components/server/*` |
| **03** | React 19 Actions & Optimistic UI | Native server actions, `useActionState`, `useOptimistic` for cart/reviews. | `actions/*.ts`, `hooks/use-optimistic-cart.ts` |
| **04** | Dynamic Segment Routing | Clean localized route parameters (`/menu/[category]/[slug]`). | `app/[locale]/menu/[category]/[slug]/page.tsx` |
| **05** | Parallel & Intercepting Modals | Instant overlay previews (`@modal/(.)menu/[category]/[slug]`). | `app/[locale]/@modal/(.)menu/[category]/[slug]/page.tsx` |
| **06** | Route Handlers Runtime Selection | Node.js vs Edge runtime declaration for optimal latency and cold starts. | `app/api/**/route.ts` (`export const runtime = 'nodejs'/'edge'`) |
| **07** | Cache Lifecycle & Revalidation | Precision invalidation using `revalidatePath` and `revalidateTag`. | `lib/cache/revalidation.ts`, tag-based fetchers |
| **08** | Edge Middleware Orchestration | Geo-routing (AT/DE/EN), bot mitigation, security headers, rate limiting. | `middleware.ts` |
| **09** | Font Optimization (Zero CLS) | `next/font/google` font preloading (Playfair Display, Inter) with fallback metrics. | `lib/fonts.ts` |
| **10** | Next Image Optimization | AVIF/WebP srcset generation, blur placeholder base64 hashing. | `next.config.ts`, `components/ui/optimized-image.tsx` |

---

## Group 2: WebGL, Three.js & 3D Interactive Graphics (Skills 11–20)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **11** | R3F Canvas Integration | Dynamic loading of `@react-three/fiber` canvas with WebGL context detection. | `components/3d/pizza-canvas.tsx` |
| **12** | Drei Helpers & Camera Rigs | `OrbitControls`, `PresentationControls`, `Float`, and `Environment` setup. | `components/3d/camera-rig.tsx`, `components/3d/scene.tsx` |
| **13** | Draco GLTF/GLB Decompression | Compressed asset loading via `useGLTF` with worker thread decompression. | `public/models/pizza-base.glb`, `components/3d/pizza-model.tsx` |
| **14** | Custom GLSL Crust Shaders | Procedural Neapolitan *cornicione* charred leopard-spot vertex/fragment shaders. | `shaders/cornicione.vert.glsl`, `shaders/cornicione.frag.glsl` |
| **15** | Procedural Steam & Smoke | Lightweight GPU particle system simulating hot wood-fired oven steam. | `components/3d/steam-particles.tsx` |
| **16** | WebGL Garbage Collection | Explicit geometry, material, and texture `.dispose()` lifecycle management. | `hooks/use-webgl-cleanup.ts` |
| **17** | Dynamic Studio Lighting & HDRI | Soft shadows, ContactShadows, customized Neapolitan kitchen HDRI reflections. | `components/3d/lighting.tsx` |
| **18** | Interactive Raycast Topping Select | 3D mesh hit testing to add/remove mozzarella, basil, and toppings. | `components/3d/topping-interactor.tsx` |
| **19** | GSAP Scroll-Linked 3D Camera | Viewport-driven camera rotations and zoom animations synced with narrative text. | `components/3d/scroll-camera.tsx` |
| **20** | Dynamic DPR & Mobile Clamping | Clamping `dpr={[1, 2]}` and dynamic resolution scaling for mid-range smartphones. | `components/3d/canvas-wrapper.tsx` |

---

## Group 3: Styling, UI & Micro-Interactions (Skills 21–30)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **21** | Tailwind Color Token Architecture | Neapolitan Tomato Red (#C8232C), Basil Green (#008C45), Warm Dough (#EAE0D5). | `tailwind.config.ts`, `app/globals.css` |
| **22** | Zero-FOUC Dark/Light Theming | CSS variable design tokens and `next-themes` SSR hydration matching. | `components/providers/theme-provider.tsx` |
| **23** | Framer Motion Staggered UI | Fluid page transitions, staggered menu card reveals, and layout morphing. | `components/animations/fade-in.tsx`, `components/animations/stagger.tsx` |
| **24** | WCAG 2.1 AA Accessibility | Keyboard navigation, ARIA live regions for cart updates, contrast validation. | `components/ui/button.tsx`, `components/ui/dialog.tsx` |
| **25** | Custom Italian SVG Micro-Motion | Animated Vespa delivery, basil leaves, and wood-fired oven flames. | `components/icons/animated-vespa.tsx`, `components/icons/animated-flame.tsx` |
| **26** | Mobile Gesture Bottom Sheets | Touch swipe-to-dismiss bottom sheet drawer for pizza customization on mobile. | `components/ui/bottom-sheet.tsx` |
| **27** | Allergen Badge System (A–R) | Official Austrian Allergen labeling with rich tooltips and dietary filters. | `components/menu/allergen-badge.tsx`, `lib/constants/allergens.ts` |
| **28** | 3D & Card Skeleton Loaders | Shimmering placeholder skeletons matching 3D bounding boxes and menu grids. | `components/ui/skeleton-pizza.tsx`, `components/ui/skeleton-card.tsx` |
| **29** | Toast Notification Engine | Accessible toast notifications for cart additions, errors, and reservation alerts. | `components/ui/toast.tsx`, `hooks/use-toast.ts` |
| **30** | GPU Parallax Compositing | `will-change: transform` hardware-accelerated parallax for story and hero sections. | `components/animations/parallax-section.tsx` |

---

## Group 4: Local SEO, Internationalization & Schema.org (Skills 31–40)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **31** | Schema.org Restaurant JSON-LD | Complete Restaurant structured data with Himberg address, coordinates, hours. | `components/seo/restaurant-jsonld.tsx` |
| **32** | Schema.org Menu & MenuItem LD | Granular menu item pricing, allergen tags, and dish descriptions for Google. | `components/seo/menu-jsonld.tsx` |
| **33** | Next-Intl Multi-Language | Route localization for German (`de-AT`) as primary and English (`en`) as fallback. | `i18n/request.ts`, `messages/de.json`, `messages/en.json` |
| **34** | Dynamic @vercel/og Images | Automated Edge OG image generator with dish title, price, and branding. | `app/[locale]/api/og/route.tsx` |
| **35** | Localized XML Sitemaps | Multi-lingual sitemap generation with automatic `xhtml:link rel="alternate"` tags. | `app/sitemap.ts` |
| **36** | Dynamic Robots.txt Pipeline | Intelligent crawl rules, sitemap declarations, and disallow paths for admin. | `app/robots.ts` |
| **37** | Austrian Geo-Targeting Tags | Coordinates (`48.0772, 16.4447`), geo.region (`AT-3`), geo.placename (`Himberg`). | `app/[locale]/layout.tsx` (Metadata) |
| **38** | BreadcrumbList Structured Data | Dynamic breadcrumb JSON-LD reflecting category hierarchies for rich snippets. | `components/seo/breadcrumb-jsonld.tsx` |
| **39** | Core Web Vitals Engineering | Precision budgeting: LCP < 1.2s, INP < 100ms, CLS = 0. | `lib/analytics/web-vitals.ts` |
| **40** | Google Business Profile Citations | NAP consistency (Name, Address, Phone: `+43 2235 42733`) and deep-links. | `lib/constants/business.ts` |

---

## Group 5: Backend API, Prisma & Database Engineering (Skills 41–50)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **41** | PostgreSQL Prisma Relational Model | Clean schema defining Categories, Items, Variants, Toppings, Tables, Orders. | `prisma/schema.prisma` |
| **42** | Data Seeding Automation | Comprehensive database seed for all authentic Neapolitan dishes and drinks. | `prisma/seed.ts` |
| **43** | Menu Hierarchy Architecture | Classiche, Gialle, Bianche, Calzone, Pasta, Dolci, Bevande. | `lib/types/menu.ts`, `prisma/schema.prisma` |
| **44** | Variants & Extra Toppings Schema | Size variations (Normal 33cm, Maxi 45cm) and modular extra toppings. | `prisma/schema.prisma` |
| **45** | Reservation Conflict Protection | SQL table constraint checks preventing overlapping bookings per table/slot. | `lib/reservations/booking-engine.ts` |
| **46** | High-Performance Indexing | Composite indexes on `[categoryId, isAvailable]`, `[orderStatus, createdAt]`. | `prisma/schema.prisma` (`@@index`) |
| **47** | Prisma Transaction Pipeline | `$transaction` wrapping checkout stock validation and reservation creation. | `lib/db/transactions.ts` |
| **48** | Redis / Upstash Cache Layer | Sub-10ms response caching for public menu endpoints with TTL invalidation. | `lib/cache/redis.ts` |
| **49** | Zero-Loss Database Migrations | Structured migration scripts with safe rollback fallbacks. | `prisma/migrations/*` |
| **50** | Automated Backup Scripts | Automated pg_dump scripts and point-in-time recovery configurations. | `scripts/backup-database.sh` |

---

## Group 6: Ordering, Cart & Payment Integration (Skills 51–60)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **51** | Zustand Persistent Cart | Client state store syncing with localStorage, handling toppings & quantity. | `lib/store/cart-store.ts` |
| **52** | Stripe Checkout Pre-Payment | Stripe payment intent creation for takeaway pickup pre-orders. | `app/api/checkout/stripe/route.ts` |
| **53** | Stripe Webhook Verification | Cryptographic signature validation (`stripe.webhooks.constructEvent`). | `app/api/webhooks/stripe/route.ts` |
| **54** | Cash-on-Pickup Flow | Dedicated workflow for in-person cash payment with order code verification. | `actions/order-actions.ts` |
| **55** | Operating Hours Calculation Engine | Real-time evaluation of current Vienna time against Little Napoli weekly hours. | `lib/utils/opening-hours.ts` |
| **56** | Server-Sent Events (SSE) Tracking | Live order progress stream (Received -> Oven -> Ready -> Picked Up). | `app/api/orders/[id]/stream/route.ts` |
| **57** | Kitchen POS Receipt Formatter | 80mm ESC/POS compatible thermal receipt text and printable HTML format. | `lib/pos/receipt-generator.ts` |
| **58** | Austrian VAT Engine (10% / 20%) | Exact tax splitting complying with Austrian fiscal regulations (UStG). | `lib/utils/tax-calculator.ts` |
| **59** | Perimeter & Minimum Order Check | Delivery perimeter radius check for Himberg, Pellendorf, Maria Lanzendorf. | `lib/utils/delivery-perimeter.ts` |
| **60** | Discount & Coupon Engine | Promo code validation (percentage, fixed amount, expiry dates, min spends). | `lib/discounts/coupon-engine.ts` |

---

## Group 7: Reservation & Communication Automation (Skills 61–70)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **61** | Table Allocation Algorithm | Dynamic seat assignment matching party size to table combinations. | `lib/reservations/table-allocator.ts` |
| **62** | Resend Transactional Emails | React Email templates for booking confirmations and order receipts. | `lib/email/templates/booking-confirmation.tsx` |
| **63** | WhatsApp Business One-Click | Direct WhatsApp link generator with pre-filled localized order payload. | `lib/comms/whatsapp.ts` |
| **64** | Direct Phone Dialer (+43) | Standardized RFC3966 click-to-call link for `tel:+43223542733`. | `components/ui/phone-link.tsx` |
| **65** | Google Maps Navigation Deep-Link | Intent-based navigation URLs to Hauptstraße 44, 2325 Himberg. | `lib/constants/maps.ts` |
| **66** | Customer Feedback Pipeline | Verified star rating submission with anti-spam rate limiting. | `actions/review-actions.ts` |
| **67** | Automated Reservation Reminders | Scheduled SMS/Email dispatch 2 hours prior to scheduled dining time. | `lib/jobs/reminder-cron.ts` |
| **68** | Cloudflare Turnstile Verification | Server-side verification of Turnstile tokens on reservation & contact forms. | `lib/security/turnstile.ts` |
| **69** | Sanitized Contact Handler | HTML sanitization (DOMPurify/sanitize-html) and admin email alert dispatch. | `actions/contact-actions.ts` |
| **70** | Double Opt-In Newsletter | DSGVO-compliant newsletter subscription with verification link generation. | `actions/newsletter-actions.ts` |

---

## Group 8: Authentication, Security & Compliance (Skills 71–80)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **71** | Auth.js / NextAuth RBAC | Admin vs Staff vs Customer role authorization guards. | `lib/auth/auth.config.ts`, `lib/auth/rbac.ts` |
| **72** | Stateless JWT Session Guard | Encrypted JWT cookies with HTTP-only, Secure, SameSite=Strict flags. | `lib/auth/jwt.ts` |
| **73** | Strict Zod Input Validation | Universal schema validation for all API routes and Server Actions. | `lib/validations/*.ts` |
| **74** | XSS & SQLi Defense Policies | Parameterized queries via Prisma, HTML escaping, sanitized inputs. | `lib/security/sanitization.ts` |
| **75** | WebGL & CDN CSP Headers | Content-Security-Policy supporting WebGL worker blobs and asset CDNs. | `next.config.ts` (Headers) |
| **76** | Redis Token Bucket Rate Limiter | IP and user based rate limiting on sensitive checkout and auth routes. | `lib/security/rate-limiter.ts` |
| **77** | DSGVO Granular Cookie Banner | Explicit consent management categorized by Necessary, Analytics, Marketing. | `components/compliance/cookie-consent.tsx` |
| **78** | Austrian Impressum & Privacy | Full legal disclosures according to §5 ECG, §25 Mediengesetz, §14 UGB. | `app/[locale]/impressum/page.tsx`, `app/[locale]/datenschutz/page.tsx` |
| **79** | T3 Env Runtime Validation | Type-safe environment variable checking at build time (`@t3-oss/env-nextjs`). | `env.mjs` |
| **80** | Admin Action Audit Logger | Immutable log entries for menu price changes and manual order cancellations. | `lib/audit/audit-logger.ts` |

---

## Group 9: Testing, Quality Assurance & Performance (Skills 81–90)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **81** | Vitest Tax & Pricing Suite | Exhaustive unit tests for 10%/20% Austrian VAT and cart calculations. | `tests/unit/tax-calculator.test.ts` |
| **82** | React Testing Library Components | UI testing for allergen modal, cart drawer, and reservation form. | `tests/components/cart-drawer.test.tsx` |
| **83** | Playwright E2E Checkout Flow | Automated browser end-to-end test from menu browsing to order placement. | `tests/e2e/checkout-flow.spec.ts` |
| **84** | Visual Regression Testing | Pixelmatch snapshot diffing for 3D canvas and responsive mobile viewports. | `tests/e2e/visual-regression.spec.ts` |
| **85** | Lighthouse CI Configuration | Automated CI checks asserting Performance >= 95, Accessibility = 100, SEO = 100. | `lighthouserc.json` |
| **86** | WebGL 60 FPS Benchmarking | Automated frame-rate test harness measuring delta times on canvas render. | `tests/benchmarks/webgl-fps.bench.ts` |
| **87** | Mock Service Worker (MSW) | Network mocking for Stripe API and Resend in testing environments. | `tests/mocks/handlers.ts` |
| **88** | TypeScript Strict & ESLint | Zero `any` policy, strict null checks, Next.js core web vitals linter rules. | `tsconfig.json`, `.eslintrc.json` |
| **89** | Next Bundle Size Analyzer | Webpack bundle visualization to prevent package bloat and heavy imports. | `next.config.ts` (Bundle Analyzer) |
| **90** | WebGL Memory Leak Profiling | CDP automated tests verifying texture disposal and 0 uncollected WebGL buffers. | `tests/benchmarks/memory-leak.test.ts` |

---

## Group 10: DevOps, Deployment & Observability (Skills 91–100)

| ID | Skill Name | Technical Scope | Target Files / Manifests |
|---|---|---|---|
| **91** | Multi-Stage Dockerfile | Production optimized Node.js Alpine container with minimal footprint. | `Dockerfile` |
| **92** | Docker Compose Orchestration | Local orchestration of Next.js, PostgreSQL 16, Redis, and Mailpit. | `docker-compose.yml` |
| **93** | GitHub Actions CI/CD Pipeline | Automated linting, testing, Prisma migrations, and deployment triggers. | `.github/workflows/ci.yml` |
| **94** | Vercel Edge Deployment | Edge Middleware and regional serverless function configuration (Frankfurt `fra1`). | `vercel.json` |
| **95** | Sentry Full-Stack Observability | Crash reporting for React component boundaries, API errors, and 3D context loss. | `sentry.client.config.ts`, `sentry.server.config.ts` |
| **96** | GA4 Web Vitals Telemetry | Real-user monitoring (RUM) reporting INP, LCP, and CLS directly to Google Analytics. | `lib/analytics/gtag.ts` |
| **97** | `/api/health` Liveness Probe | Database, Redis, and external API connectivity status probe for uptime monitors. | `app/api/health/route.ts` |
| **98** | Immutable CDN Asset Caching | Cache-Control headers (`public, max-age=31536000, immutable`) on 3D/image assets. | `next.config.ts` |
| **99** | Zero-Downtime DB Migrations | Expand/Contract pattern documentation and deployment safeguards. | `docs/MIGRATION_STRATEGY.md` |
| **100** | Automated Production Rollback | Error rate threshold monitoring triggering instant Vercel rollback on spike. | `.github/workflows/rollback.yml` |
