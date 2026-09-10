# Little Napoli: Enterprise Architecture Specification

## 1. System Topology

The Little Napoli platform is built as a modular monorepo consisting of:
- `apps/backend-laravel`: High-performance RESTful API, transactional persistence, Filament admin panel, Redis queues, and Austrian compliance engine.
- `apps/frontend-nextjs`: Next.js 15 App Router frontend featuring React 19 Server Components, Three.js WebGL pizza customizer, `next-intl` localization (`de-AT`/`en`), and JSON-LD structured data.

---

## 2. API Communication Contract

All communication between the Next.js frontend and Laravel backend adheres to the versioned `/api/v1/` prefix:

- `GET /api/v1/menu/categories` - Cached menu categories with item counts.
- `GET /api/v1/menu/items/{slug}` - Granular dish details, allergens (A–R), and 3D asset metadata.
- `POST /api/v1/orders` - Order placement (Click & Collect cash pickup or Stripe PaymentIntent).
- `POST /api/v1/reservations` - Table booking request with automated seat allocation and pessimistic lock.
- `POST /api/v1/webhooks/stripe` - Idempotent Stripe webhook receiver with signature validation.
- `GET /api/v1/health` - Liveness and readiness probe for PostgreSQL, Redis, and storage.

---

## 3. Deployment & Infrastructure Strategy

- **Edge Layer:** Cloudflare CDN & Vercel Edge for static assets, AVIF/WebP images, Draco `.glb` models, and DDoS mitigation.
- **Application Servers:** Containerized PHP 8.3-FPM + Nginx (Laravel) and Node.js Alpine (Next.js) orchestrated via Docker Compose in local development and Kubernetes/Fly.io/AWS in production.
- **Database:** Managed PostgreSQL 16 instance with automated daily snapshots and point-in-time recovery.
