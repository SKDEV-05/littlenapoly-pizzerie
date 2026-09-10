# Rule 06: Ordering, Cart & Payment Integration

## 1. Scope & Applicable Skills
This rule enforces checkout workflows, Austrian VAT compliance, and payment processing for **Skills 061–070**.

- **Skill 061:** Persistent client cart using Zustand synchronized with Laravel backend.
- **Skill 062:** Stripe Payment Intents supporting Apple Pay, Google Pay, and European cards.
- **Skill 063:** Cryptographic Stripe Webhook signature verification and idempotency.
- **Skill 064:** Click & Collect cash-on-pickup order flow with SMS confirmation.
- **Skill 065:** Kitchen opening-hours engine (blocking checkouts when oven is offline).
- **Skill 066:** Real-time live order tracking via WebSockets / SSE.
- **Skill 067:** Automated 80mm ESC/POS thermal printer layout generation for the kitchen.
- **Skill 068:** Austrian dual-tier VAT calculation service (10% food, 20% beverages).
- **Skill 069:** Delivery perimeter radius and minimum order value verification.
- **Skill 070:** Promotional discount voucher evaluation service.

---

## 2. Austrian Fiscal Tax Engine (10% vs 20% UStG)

Austrian value-added tax law (UStG) strictly separates food and beverage items:
- **Food (Speisen / Pizza / Pasta / Dolci):** 10% VAT
- **Beverages (Getränke / Alcohol / Soft drinks):** 20% VAT

```php
namespace App\Services;

class TaxCalculationService
{
    public function calculateTaxes(array $items): array
    {
        $foodGross = 0.0;
        $drinkGross = 0.0;

        foreach ($items as $item) {
            $lineTotal = $item['unit_price'] * $item['quantity'];
            if ($item['is_beverage']) {
                $drinkGross += $lineTotal;
            } else {
                $foodGross += $lineTotal;
            }
        }

        // Calculate Net and Tax portions based on inclusive Austrian pricing
        $foodNet = $foodGross / 1.10;
        $foodVat = $foodGross - $foodNet;

        $drinkNet = $drinkGross / 1.20;
        $drinkVat = $drinkGross - $drinkNet;

        return [
            'gross_total'  => round($foodGross + $drinkGross, 2),
            'food_gross'   => round($foodGross, 2),
            'food_net'     => round($foodNet, 2),
            'food_vat_10'  => round($foodVat, 2),
            'drink_gross'  => round($drinkGross, 2),
            'drink_net'    => round($drinkNet, 2),
            'drink_vat_20' => round($drinkVat, 2),
            'total_vat'    => round($foodVat + $drinkVat, 2),
        ];
    }
}
```

---

## 3. Opening Hours Enforcement Engine (Skill 065)

Orders can only be accepted when the Little Napoli wood-fired oven is operating in the `Europe/Vienna` timezone:

```php
namespace App\Services;

use Carbon\Carbon;

class OperatingHoursService
{
    // Little Napoli Hours: Tue-Sun 11:00 - 22:00 (Monday Closed)
    public function isOvenOnline(): bool
    {
        $now = Carbon::now('Europe/Vienna');
        $dayOfWeek = $now->dayOfWeek; // 0 = Sunday, 1 = Monday

        if ($dayOfWeek === Carbon::MONDAY) {
            return false;
        }

        $openTime = $now->copy()->setTime(11, 0, 0);
        $closeTime = $now->copy()->setTime(21, 45, 0); // Last order 15 min prior to close

        return $now->between($openTime, $closeTime);
    }
}
```
