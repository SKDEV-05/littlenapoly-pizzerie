# Rule 07: Security, Governance & Compliance (DSGVO / GDPR)

## 1. Scope & Applicable Skills
This rule enforces cybersecurity, Austrian legal compliance, and data protection for **Skills 081–090**.

- **Skill 081:** Filament Admin panel integration for staff menu/order management.
- **Skill 082:** Content Security Policy (CSP) headers tailored for WebGL workers, CDNs, and Stripe.
- **Skill 083:** Strict request payload sanitization defending against XSS and SQLi.
- **Skill 084:** Austrian/EU GDPR (DSGVO) compliant cookie consent banner with script blocking.
- **Skill 085:** Legally compliant Austrian Impressum (§5 ECG, §25 Mediengesetz, §14 UGB).
- **Skill 086:** Runtime environment variable validation using `@t3-oss/env-nextjs` and Laravel Dotenv.
- **Skill 087:** Immutable append-only audit logger for price alterations.
- **Skill 088:** Strict CORS configuration connecting frontend origin to backend.
- **Skill 089:** IP-based brute-force throttling on administrative login endpoints.
- **Skill 090:** Automated customer data purge policies (GDPR Right-to-be-Forgotten).

---

## 2. Content Security Policy for WebGL & CDNs (Skill 082)

The Next.js edge configuration must set a strict Content Security Policy permitting Three.js WebGL blobs and Stripe elements:

```typescript
// next.config.ts
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://challenges.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://littlenapoli.at https://*.stripe.com;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://littlenapoli.at https://api.stripe.com https://challenges.cloudflare.com;
    worker-src 'self' blob:;
    frame-src 'self' https://js.stripe.com https://challenges.cloudflare.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
```

---

## 3. Austrian Legal Impressum Disclosure Requirements (Skill 085)

Under §5 E-Commerce-Gesetz (ECG) and §25 Mediengesetz (Austrian Law), the Impressum page MUST declare:
1. **Unternehmensbezeichnung:** Pizzeria Little Napoli (Inhaber/Betreiber)
2. **Standort der Gewerbeberechtigung:** Hauptstraße 44, 2325 Himberg bei Wien, Österreich
3. **Kontaktdaten:** Telefon: `+43 2235 42733`, E-Mail: `info@littlenapoli.at`
4. **Zuständige Kammer:** Wirtschaftskammer Niederösterreich (WKNÖ) - Fachgruppe Gastronomie
5. **Gewerbeordnung:** www.ris.bka.gv.at (Gewerbeordnung 1994)
6. **Aufsichtsbehörde:** Bezirkshauptmannschaft Bruck an der Leitha
