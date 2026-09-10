# Little Napoli: Canonical 100-Skill Matrix Registry

This document defines all 100 production capabilities, responsibilities, target files, and execution guidelines for the **Little Napoli** enterprise ecosystem (Laravel Backend + Next.js 15 Client + Three.js 3D WebGL + Hyper-Local Austrian SEO).

---

## Group 1: Laravel Backend Core & REST API Architecture (Skills 001–010)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 001** | Service-Repository Pattern | Isolate all domain business logic from controllers into dedicated service layers and repository interfaces. | `apps/backend-laravel/app/Services/*`, `apps/backend-laravel/app/Repositories/*` |
| **Skill 002** | Austrian Form Requests | Request validation with strict Austrian phone (`^(\+43\|0)[1-9][0-9]{3,12}$`) and postal code (`^[1-9][0-9]{3}$`) regexes. | `apps/backend-laravel/app/Http/Requests/*` |
| **Skill 003** | Eloquent API Resources | Uniform, normalized JSON transformers enforcing snake_case to camelCase mapping and ISO 8601 UTC timestamps. | `apps/backend-laravel/app/Http/Resources/*` |
| **Skill 004** | Laravel Sanctum Auth | Token-based auth for mobile/admin and secure HTTP-only cookie sessions for web client. | `apps/backend-laravel/config/sanctum.php`, `app/Http/Middleware/EnsureFrontendRequestsAreStateful.php` |
| **Skill 005** | Spatie RBAC Authorization | Role-based access control with granular permissions: `admin`, `kitchen_staff`, `service_staff`, `customer`. | `apps/backend-laravel/database/seeders/RolesAndPermissionsSeeder.php` |
| **Skill 006** | Versioned REST API Routing | API routing under `/api/v1/` with explicit semantic contracts for Menu, Orders, Reservations, and Webhooks. | `apps/backend-laravel/routes/api.php`, `routes/api/v1.php` |
| **Skill 007** | Redis Tiered Rate Limiting | Rate limiting tiers: Public Menu (120 req/min), Cart/Checkout (10 req/min), Admin Auth (5 req/min). | `apps/backend-laravel/app/Providers/RouteServiceProvider.php` |
| **Skill 008** | RFC 7807 Exception Handler | Global exception handler returning standard `application/problem+json` payloads with trace IDs. | `apps/backend-laravel/bootstrap/app.php`, `app/Exceptions/Handler.php` |
| **Skill 009** | Async Queue Workers | Asynchronous Redis queue workers for email dispatches, SMS triggers, and 80mm thermal receipt generation. | `apps/backend-laravel/app/Jobs/*`, `config/queue.php` |
| **Skill 010** | Event & Listener Architecture | Domain events (`OrderPlaced`, `ReservationConfirmed`, `MenuUpdated`) triggering decoupled listeners. | `apps/backend-laravel/app/Events/*`, `app/Listeners/*` |

---

## Group 2: Eloquent ORM, Database & Data Architecture (Skills 011–020)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 011** | PostgreSQL Relational Schema | High-integrity relational schema with strict foreign key cascades and check constraints. | `apps/backend-laravel/database/migrations/*` |
| **Skill 012** | Zero-Downtime DB Migrations | Expand-and-contract migration patterns guaranteeing non-breaking schema deployments. | `apps/backend-laravel/database/migrations/*` |
| **Skill 013** | Little Napoli Menu Seeders | Seeders for all 8 categories: Pizze Classiche, Pizze Gialle, Pizze Bianche, Calzoni, Pasta, Insalate, Dolci, Bevande. | `apps/backend-laravel/database/seeders/MenuSeeder.php` |
| **Skill 014** | Polymorphic Product Relations | Flexible relations for extra toppings, crust styles (Cornicione Ripieno), and size variations (Normal Ø33cm, Maxi Ø45cm). | `apps/backend-laravel/app/Models/MenuItem.php`, `app/Models/Topping.php` |
| **Skill 015** | Austrian Codex Allergen Map | Strict EU/Austrian Allergen Codex implementation (Letters A to R) attached to all recipes and ingredients. | `apps/backend-laravel/app/Enums/AllergenCodex.php`, `app/Models/Allergen.php` |
| **Skill 016** | Pessimistic Lock Reservations | Database transactions with `lockForUpdate()` on table reservation slots to prevent overbooking. | `apps/backend-laravel/app/Services/ReservationService.php` |
| **Skill 017** | Eager Loading & N+1 Eradication | Automated query inspection (`Model::preventLazyLoading(!app()->isProduction())`) and eager loading relationships. | `apps/backend-laravel/app/Repositories/EloquentMenuRepository.php` |
| **Skill 018** | Eloquent Soft Deletions | `SoftDeletes` applied to Orders, Reservations, and Customer profiles for auditing and recovery. | `apps/backend-laravel/app/Models/Order.php`, `app/Models/Reservation.php` |
| **Skill 019** | Composite B-Tree Indexing | Optimized composite indexes on `[category_id, is_active]`, `[slug]`, and `[reserved_date, time_slot]`. | `apps/backend-laravel/database/migrations/indexes.php` |
| **Skill 020** | Automated Postgres Snapshots | Automated daily pg_dump scripts with point-in-time recovery and S3 offsite replication. | `scripts/backup-postgresql.sh` |

---

## Group 3: Next.js 15 & React 19 Client Engine (Skills 021–030)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 021** | Next.js 15 App Router | Decoupled App Router architecture consuming the Laravel REST API with ISR and SSR. | `apps/frontend-nextjs/src/app/*` |
| **Skill 022** | SSR Tag Revalidation | Fetch cache invalidation via `next: { tags: ['menu', 'categories'] }` triggered by Laravel webhooks. | `apps/frontend-nextjs/src/lib/api/menu.ts` |
| **Skill 023** | React 19 Actions & Optimistic UI | `useActionState` and `useOptimistic` for instant cart mutations and real-time state synchronization. | `apps/frontend-nextjs/src/actions/*`, `src/hooks/use-cart.ts` |
| **Skill 024** | Parallel & Intercepting Modals | Quick-view pizza modals using `@modal/(.)menu/[category]/[slug]` with deep-linkable URLs. | `apps/frontend-nextjs/src/app/[locale]/@modal/(.)menu/[category]/[slug]/page.tsx` |
| **Skill 025** | Dynamic Dynamic Segment Routing | Clean slug routing `/menu/[category]/[slug]` with pre-rendered static params (`generateStaticParams`). | `apps/frontend-nextjs/src/app/[locale]/menu/[category]/[slug]/page.tsx` |
| **Skill 026** | Zero-CLS Typography | `next/font/google` preloading Playfair Display and Inter with `display: 'swap'` and layout shift fallbacks. | `apps/frontend-nextjs/src/lib/fonts.ts` |
| **Skill 027** | Next Image AVIF/WebP Pipeline | Responsive `<Image />` optimization with remote pattern allowlists for Laravel media storage. | `apps/frontend-nextjs/next.config.ts`, `src/components/ui/optimized-image.tsx` |
| **Skill 028** | Hydration Error Isolation | Dynamic client-only imports (`ssr: false`) for Three.js canvases, audio triggers, and local storage readers. | `apps/frontend-nextjs/src/components/3d/dynamic-canvas.tsx` |
| **Skill 029** | Edge Middleware Geo-Routing | Edge middleware detecting browser language and Austrian IP location, routing to `/de-AT` or `/en`. | `apps/frontend-nextjs/src/middleware.ts` |
| **Skill 030** | Accessible Error Boundaries | Granular React error boundaries and offline fallback screens preserving navigation state. | `apps/frontend-nextjs/src/app/error.tsx`, `src/app/not-found.tsx` |

---

## Group 4: WebGL, Three.js & 3D Interactive Graphics (Skills 031–040)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 031** | R3F Canvas Isolation | `@react-three/fiber` isolated canvas with WebGL context loss listeners and WebGL 2.0 fallback. | `apps/frontend-nextjs/src/components/3d/PizzaCanvas.tsx` |
| **Skill 032** | Drei Camera Controls & Rigs | Damped camera rigs using `PresentationControls`, `Float`, and `ContactShadows` for tactile realism. | `apps/frontend-nextjs/src/components/3d/CameraRig.tsx` |
| **Skill 033** | Draco & Meshopt GLTF Pipeline | Asset loading via `useGLTF` with worker thread Draco decompression (under 1.2MB assets). | `apps/frontend-nextjs/public/models/pizza-base.glb` |
| **Skill 034** | Custom GLSL Crust Shaders | Procedural Neapolitan *cornicione* shaders calculating charred leopard spots via 3D Simplex noise. | `apps/frontend-nextjs/src/shaders/cornicione.vert.glsl`, `cornicione.frag.glsl` |
| **Skill 035** | Procedural Steam Particles | Lightweight GPU particle system simulating rising wood-fired oven steam. | `apps/frontend-nextjs/src/components/3d/SteamParticles.tsx` |
| **Skill 036** | WebGL Garbage Collection | Explicit geometry, material, and texture `.dispose()` lifecycle sweeps on component unmount. | `apps/frontend-nextjs/src/hooks/useWebGLCleanup.ts` |
| **Skill 037** | Studio HDR & Contact Shadows | Studio-grade warm Italian trattoria HDRI lighting environment with soft contact shadows. | `apps/frontend-nextjs/src/components/3d/LightingEnvironment.tsx` |
| **Skill 038** | Raycasting Topping Selector | 3D Raycasting hit-testing allowing users to click ingredients to inspect origin (e.g. San Marzano DOP). | `apps/frontend-nextjs/src/components/3d/ToppingSelector.tsx` |
| **Skill 039** | GSAP ScrollTrigger 3D Stage | Scroll-linked 3D camera transitions exploding pizza layers (crust, sauce, mozzarella, basil) on scroll. | `apps/frontend-nextjs/src/components/3d/ScrollStage.tsx` |
| **Skill 040** | Dynamic DPR Mobile Clamping | Clamping `dpr={[1, 2]}` with automatic LOD (Level of Detail) downgrade on low-performance devices. | `apps/frontend-nextjs/src/components/3d/CanvasContainer.tsx` |

---

## Group 5: UI, Styling & Accessibility (Skills 041–050)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 041** | Tailwind v4 Neapolitan Tokens | Design tokens: San Marzano Red (`#C8232C`), Datterino Yellow (`#F4A900`), Basil Green (`#008C45`), Warm Crust (`#EAE0D5`). | `apps/frontend-nextjs/src/styles/globals.css`, `tailwind.config.ts` |
| **Skill 042** | Zero-FOUT Theme Engine | CSS custom property driven dark/light theme switching with instant inline script bootstrap. | `apps/frontend-nextjs/src/components/providers/ThemeProvider.tsx` |
| **Skill 043** | Framer Motion Menu Transitions | Staggered layout reveals for menu category cards with spring physics. | `apps/frontend-nextjs/src/components/animations/StaggerMenu.tsx` |
| **Skill 044** | WCAG 2.1 AA Compliance | 100% keyboard navigable dialogs, focus traps, aria-live updates on cart mutations, and 4.5:1 contrast. | `apps/frontend-nextjs/src/components/ui/Modal.tsx` |
| **Skill 045** | Animated Italian SVG Icons | Hand-crafted SVG micro-animations: Vintage Italian Vespa, wood-fired oven flames, floating basil leaf. | `apps/frontend-nextjs/src/components/icons/*` |
| **Skill 046** | Mobile Gesture Bottom Sheet | Touch-first swipeable bottom sheet for selecting crust variants and extra toppings. | `apps/frontend-nextjs/src/components/ui/BottomSheet.tsx` |
| **Skill 047** | Allergen Codex Badge (A–R) | Interactive badge UI with Austrian allergen letter designations and allergen description popovers. | `apps/frontend-nextjs/src/components/menu/AllergenBadge.tsx` |
| **Skill 048** | Canvas & Card Skeleton Loaders | Geometry-accurate shimmering skeleton placeholders preventing visual jumps during data fetch. | `apps/frontend-nextjs/src/components/ui/SkeletonCard.tsx` |
| **Skill 049** | Accessible Toast System | Screen-reader friendly toast notification pipeline with action undo capabilities. | `apps/frontend-nextjs/src/components/ui/Toast.tsx` |
| **Skill 050** | GPU Parallax Compositing | Hardware-accelerated CSS/JS parallax scrolling on story sections using `transform: translate3d`. | `apps/frontend-nextjs/src/components/animations/ParallaxSection.tsx` |

---

## Group 6: Local SEO, Internationalization & Structured Data (Skills 051–060)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 051** | Restaurant Schema.org JSON-LD | Exact NAP, geo-coordinates (`48.0772, 16.4447`), opening hours, and reservation actions. | `apps/frontend-nextjs/src/components/seo/RestaurantJsonLd.tsx` |
| **Skill 052** | Dynamic Menu Schema.org JSON-LD | Real-time `Menu` and `MenuItem` structured markup populated from Laravel API data. | `apps/frontend-nextjs/src/components/seo/MenuJsonLd.tsx` |
| **Skill 053** | Bilingual `next-intl` Engine | Full `de-AT` and `en` message catalogs with parameter interpolation and route prefixing. | `apps/frontend-nextjs/src/i18n/*`, `messages/de-AT.json`, `messages/en.json` |
| **Skill 054** | Dynamic @vercel/og Cards | Edge-generated social cards displaying dish names, high-res photos, and Little Napoli branding. | `apps/frontend-nextjs/src/app/api/og/route.tsx` |
| **Skill 055** | Localized XML Sitemap Index | Automated XML sitemaps with `xhtml:link` hreflang alternates for Austrian German and English. | `apps/frontend-nextjs/src/app/sitemap.ts` |
| **Skill 056** | Dynamic Robots.txt Engine | Search engine crawl rules with sitemap references and admin route blocking. | `apps/frontend-nextjs/src/app/robots.ts` |
| **Skill 057** | Austrian Geo-Targeting Tags | Geo-metadata: `geo.region: AT-3`, `geo.placename: Himberg`, `geo.position: 48.0772;16.4447`, `ICBM: 48.0772, 16.4447`. | `apps/frontend-nextjs/src/app/[locale]/layout.tsx` |
| **Skill 058** | BreadcrumbList Structured Data | Dynamic Breadcrumb JSON-LD schemas reflecting hierarchical category navigations. | `apps/frontend-nextjs/src/components/seo/BreadcrumbsJsonLd.tsx` |
| **Skill 059** | Core Web Vitals Budgeting | Telemetry tracking asserting LCP < 1.2s, INP < 100ms, and CLS = 0 in production. | `apps/frontend-nextjs/src/lib/analytics/vitals.ts` |
| **Skill 060** | Google Business Profile Citations | NAP synchronization and direct Google Review redirect intent links. | `apps/frontend-nextjs/src/lib/constants/business.ts` |

---

## Group 7: Ordering, Cart & Payment Integration (Skills 061–070)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 061** | Zustand Persistent Sync Cart | LocalStorage synced cart state reconciled with Laravel backend pricing sessions. | `apps/frontend-nextjs/src/store/cartStore.ts` |
| **Skill 062** | Stripe Payment Intents | Server-side payment intent generation supporting Apple Pay, Google Pay, and European cards. | `apps/backend-laravel/app/Services/StripePaymentService.php` |
| **Skill 063** | Stripe Webhook Processor | Cryptographic signature validation handling `payment_intent.succeeded` with idempotent processing. | `apps/backend-laravel/app/Http/Controllers/Api/V1/StripeWebhookController.php` |
| **Skill 064** | Cash-on-Pickup Order Flow | Takeaway order flow generating unique alphanumeric pickup codes with SMS confirmation. | `apps/backend-laravel/app/Services/OrderService.php` |
| **Skill 065** | Kitchen Operating Hours Engine | Real-time European/Vienna timezone validator blocking orders outside open kitchen hours. | `apps/backend-laravel/app/Services/OperatingHoursService.php` |
| **Skill 066** | Live Order WebSocket Stream | Real-time order lifecycle status stream via Laravel Reverb / SSE (Received -> Oven -> Ready -> Picked Up). | `apps/backend-laravel/app/Events/OrderStatusUpdated.php` |
| **Skill 067** | 80mm ESC/POS Thermal Printer | ESC/POS receipt generation formatted for kitchen tickets with large order numbers and topping callouts. | `apps/backend-laravel/app/Services/PosPrinterService.php` |
| **Skill 068** | Austrian Dual VAT Engine | Fiscal engine splitting 10% food VAT and 20% beverage VAT according to Austrian UStG. | `apps/backend-laravel/app/Services/TaxCalculationService.php` |
| **Skill 069** | Delivery Radius & Minimum Spend | Geo-fence validation verifying delivery addresses within Himberg, Pellendorf, and Maria Lanzendorf perimeters. | `apps/backend-laravel/app/Services/DeliveryPerimeterService.php` |
| **Skill 070** | Single-Use Promo Code Engine | Discount coupon service validating expiry, minimum basket thresholds, and single-use constraints. | `apps/backend-laravel/app/Services/DiscountService.php` |

---

## Group 8: Reservations & Operational Automation (Skills 071–080)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 071** | Seating Allocation Algorithm | Knapsack table assignment algorithm optimizing indoor/terrace seating for party sizes 1 to 20. | `apps/backend-laravel/app/Services/TableAllocationService.php` |
| **Skill 072** | Resend Transactional Emails | High-conversion HTML/text email templates dispatched via Resend API for bookings and order receipts. | `apps/backend-laravel/app/Mail/ReservationConfirmedMail.php` |
| **Skill 073** | WhatsApp Business One-Click | Formatted WhatsApp message link generator with pre-filled localized orders and reservations. | `apps/frontend-nextjs/src/lib/comms/whatsapp.ts` |
| **Skill 074** | Direct-Dial Phone Handler | Click-to-call link for `tel:+43223542733` with client-side analytics event tracking. | `apps/frontend-nextjs/src/components/ui/PhoneLink.tsx` |
| **Skill 075** | Map Deep-Link Launcher | Deep-link routing opening Apple Maps on iOS and Google Maps on Android to Hauptstraße 44, Himberg. | `apps/frontend-nextjs/src/lib/comms/mapLinks.ts` |
| **Skill 076** | Post-Dining Review Loop | Automated email/SMS sent 2 hours after completed reservations linking to Google Review. | `apps/backend-laravel/app/Jobs/SendFeedbackRequestJob.php` |
| **Skill 077** | Automated SMS Reminders | Automated SMS reminder sent 2 hours before dining time with one-click cancellation. | `apps/backend-laravel/app/Jobs/SendReservationReminderJob.php` |
| **Skill 078** | Cloudflare Turnstile Bot Defense | Cryptographic token verification blocking automated spam submissions on public forms. | `apps/backend-laravel/app/Services/TurnstileService.php` |
| **Skill 079** | Sanitized Contact Handler | HTML input sanitization (HTMLPurifier), spam keyword filtering, and instant staff notification. | `apps/backend-laravel/app/Http/Controllers/Api/V1/ContactController.php` |
| **Skill 080** | Double Opt-In Newsletter | DSGVO-compliant newsletter subscription pipeline generating encrypted email verification tokens. | `apps/backend-laravel/app/Services/NewsletterService.php` |

---

## Group 9: Security, Governance & Compliance (Skills 081–090)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 081** | Filament Admin Dashboard | Secure administrative panel for menu pricing, allergen assignments, and live orders. | `apps/backend-laravel/app/Filament/Resources/*` |
| **Skill 082** | Strict CSP Header Rules | Content-Security-Policy permitting WebGL worker blobs, Stripe scripts, and CDN assets. | `apps/frontend-nextjs/next.config.ts` (Headers) |
| **Skill 083** | Request Payload Sanitization | Deep recursive sanitization middleware blocking XSS, SQL injection, and prototype pollution. | `apps/backend-laravel/app/Http/Middleware/SanitizeInput.php` |
| **Skill 084** | DSGVO Cookie Consent Banner | Granular cookie consent management (Essential, Analytics, Marketing) with zero pre-consent tracking. | `apps/frontend-nextjs/src/components/compliance/CookieBanner.tsx` |
| **Skill 085** | Austrian Impressum (ECG/UGB) | Full legal disclosure page adhering to §5 E-Commerce-Gesetz, §25 Mediengesetz, and §14 UGB. | `apps/frontend-nextjs/src/app/[locale]/impressum/page.tsx` |
| **Skill 086** | Type-Safe Env Validation | Runtime environment variable validation using `@t3-oss/env-nextjs` and Laravel Dotenv validation. | `apps/frontend-nextjs/src/env.mjs`, `apps/backend-laravel/app/Providers/AppServiceProvider.php` |
| **Skill 087** | Immutable Admin Audit Log | Database audit table tracking menu price modifications, manual order edits, and staff logins. | `apps/backend-laravel/app/Models/AuditLog.php`, `app/Observers/MenuItemObserver.php` |
| **Skill 088** | Strict CORS Configuration | Explicit CORS origin binding connecting `https://littlenapoli.at` and local development ports. | `apps/backend-laravel/config/cors.php` |
| **Skill 089** | IP Brute-Force Throttling | Exponential backoff rate limiter on all administrative authentication endpoints. | `apps/backend-laravel/app/Http/Middleware/AdminThrottle.php` |
| **Skill 090** | GDPR Right-to-be-Forgotten | Automated Artisan command purging customer personal data after retention periods. | `apps/backend-laravel/app/Console/Commands/PurgeExpiredCustomerData.php` |

---

## Group 10: Testing, DevOps & Observability (Skills 091–100)

| Skill ID | Skill Name | Architecture Scope & Execution | Target File / Artifact Path |
|---|---|---|---|
| **Skill 091** | Pest PHP Backend Test Suite | Comprehensive unit/feature tests for Austrian VAT calculation, orders, and table allocations. | `apps/backend-laravel/tests/Feature/*`, `tests/Unit/*` |
| **Skill 092** | Vitest & RTL Component Tests | Client-side unit and integration tests for cart store, allergen modal, and checkout flow. | `apps/frontend-nextjs/tests/components/*` |
| **Skill 093** | Playwright E2E Test Suite | Browser test automation covering complete pizza customization, checkout, and table booking. | `apps/frontend-nextjs/tests/e2e/checkout.spec.ts` |
| **Skill 094** | Multi-Stage Dockerfiles | Production Alpine Dockerfiles for PHP 8.3 FPM / Nginx and Node.js Next.js runtime. | `apps/backend-laravel/Dockerfile`, `apps/frontend-nextjs/Dockerfile` |
| **Skill 095** | Docker Compose Environment | Local container orchestration running PHP-FPM, Nginx, Next.js, PostgreSQL 16, and Redis. | `docker-compose.yml` |
| **Skill 096** | GitHub Actions CI/CD | Continuous integration pipeline executing Pint, PHPStan, Pest, ESLint, Vitest, and Playwright. | `.github/workflows/ci.yml` |
| **Skill 097** | Full-Stack Sentry Monitoring | Error tracking and performance tracing for Laravel backend exceptions and Next.js client crashes. | `apps/backend-laravel/config/sentry.php`, `apps/frontend-nextjs/sentry.config.ts` |
| **Skill 098** | Zero-Dependency `/api/health` | Deep health-check endpoint validating PostgreSQL connection, Redis ping, and storage permissions. | `apps/backend-laravel/routes/api.php`, `apps/frontend-nextjs/src/app/api/health/route.ts` |
| **Skill 099** | Immutable CDN Asset Caching | Cloudflare/Nginx cache-control headers (`public, max-age=31536000, immutable`) on 3D/image assets. | `apps/frontend-nextjs/next.config.ts`, `docker/nginx.conf` |
| **Skill 100** | Blue-Green Zero-Downtime Rollout | Atomic deployment scripts with database backup snapshots and automated rollbacks on failure. | `scripts/deploy-production.sh` |
