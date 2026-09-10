# Rule 08: Testing, DevOps & Observability

## 1. Scope & Applicable Skills
This rule enforces automated verification, deployment, and monitoring standards for **Skills 091–100**.

- **Skill 091:** Pest PHP automated test suite covering pricing, taxes, orders, and reservations.
- **Skill 092:** Vitest and React Testing Library component integration suite.
- **Skill 093:** Playwright end-to-end user checkout and table reservation test runs.
- **Skill 094:** Multi-stage Dockerfile setup for Laravel (PHP-FPM/Nginx) and Next.js.
- **Skill 095:** Local Docker Compose environment orchestrating PHP, Node.js, PostgreSQL, and Redis.
- **Skill 096:** GitHub Actions CI/CD pipeline (Lint, Static Analysis, Pest, Build, Healthcheck).
- **Skill 097:** Sentry application monitoring integrated into both frontend and backend.
- **Skill 098:** Zero-dependency deep health-check endpoint (`/api/health`) on both services.
- **Skill 099:** Asset caching and CDN header configuration (immutable static caching).
- **Skill 100:** Automated database backup and blue-green zero-downtime deployment script.

---

## 2. Automated Pest PHP Unit Test Spec (Austrian VAT)

```php
// tests/Unit/TaxCalculationServiceTest.php
use App\Services\TaxCalculationService;

it('correctly calculates Austrian dual-tier VAT for pizza and beer', function () {
    $taxService = new TaxCalculationService();

    $cartItems = [
        [
            'name'        => 'Pizza Margherita D.O.P.',
            'unit_price'  => 12.50, // Food 10% VAT
            'quantity'    => 2,
            'is_beverage' => false,
        ],
        [
            'name'        => 'Birra Moretti 0.33l',
            'unit_price'  => 4.20,  // Beverage 20% VAT
            'quantity'    => 2,
            'is_beverage' => true,
        ],
    ];

    $result = $taxService->calculateTaxes($cartItems);

    // Food gross: 25.00 EUR -> 10% VAT = 2.27 EUR (Net = 22.73 EUR)
    expect($result['food_gross'])->toBe(25.00);
    expect($result['food_vat_10'])->toBe(2.27);

    // Drink gross: 8.40 EUR -> 20% VAT = 1.40 EUR (Net = 7.00 EUR)
    expect($result['drink_gross'])->toBe(8.40);
    expect($result['drink_vat_20'])->toBe(1.40);

    // Total gross: 33.40 EUR -> Total VAT: 3.67 EUR
    expect($result['gross_total'])->toBe(33.40);
    expect($result['total_vat'])->toBe(3.67);
});
```

---

## 3. Deep Health Check Endpoint Contract (Skill 098)

Both Laravel and Next.js must expose `/api/health` returning zero-latency health checks:

```json
{
  "status": "healthy",
  "timestamp": "2026-09-11T00:28:00Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "storage": "writable"
  },
  "version": "1.0.0"
}
```
