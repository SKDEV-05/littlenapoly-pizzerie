# Command: audit-seo

## Description
Runs comprehensive validation on all local SEO, Schema.org JSON-LD structured data, hreflang alternates, and Core Web Vitals targets for Little Napoli.

## Execution Steps
1. Validates Schema.org `Restaurant` and `Menu` JSON-LD schemas against Google Rich Results standards.
2. Checks NAP consistency across all pages (Hauptstraße 44, 2325 Himberg, `+43 2235 42733`).
3. Verifies bilingual sitemaps (`sitemap.xml`) and canonical hreflang mappings (`de-AT` and `en`).
4. Runs Lighthouse CI asserting Performance >= 95, Accessibility = 100, and SEO = 100.

## CLI Invocation
```bash
npm --prefix apps/frontend-nextjs run test:seo
```
