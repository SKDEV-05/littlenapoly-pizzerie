<?php

namespace App\Services;

class TaxCalculationService
{
    /**
     * Calculates Austrian UStG taxes for cart items.
     * Food & Soft Drinks: 10% VAT
     * Alcoholic Beverages: 20% VAT
     *
     * Prices are Gross (inclusive of tax).
     */
    public function calculateTaxes(array $items): array
    {
        $foodGross = 0.0;
        $drinkGross = 0.0;

        foreach ($items as $item) {
            $lineTotal = round($item['unit_price'] * $item['quantity'], 2);
            if (!empty($item['is_alcoholic'])) {
                $drinkGross += $lineTotal;
            } else {
                $foodGross += $lineTotal;
            }
        }

        // Net and VAT calculation from gross amounts
        $foodNet = round($foodGross / 1.10, 2);
        $foodVat10 = round($foodGross - $foodNet, 2);

        $drinkNet = round($drinkGross / 1.20, 2);
        $drinkVat20 = round($drinkGross - $drinkNet, 2);

        $subtotal = round($foodGross + $drinkGross, 2);
        $totalVat = round($foodVat10 + $drinkVat20, 2);

        return [
            'subtotal'     => $subtotal,
            'food_gross'   => $foodGross,
            'food_net'     => $foodNet,
            'food_vat_10'  => $foodVat10,
            'drink_gross'  => $drinkGross,
            'drink_net'    => $drinkNet,
            'drink_vat_20' => $drinkVat20,
            'total_vat'    => $totalVat,
            'total_amount' => $subtotal,
            'currency'     => 'EUR',
        ];
    }
}
