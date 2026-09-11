<?php

namespace Tests\Feature;

use App\Services\TaxCalculationService;
use Tests\TestCase;

class TaxCalculationTest extends TestCase
{
    /**
     * Verifies that the Austrian Dual VAT split is calculated with precision.
     */
    public function test_austrian_dual_vat_calculation(): void
    {
        $taxService = new TaxCalculationService();

        // 2x Regina Margherita (€9.90 gross, 10% food VAT)
        // 2x Birra Moretti (€4.50 gross, 20% alcohol VAT)
        $items = [
            [
                'name'         => 'Regina Margherita',
                'unit_price'   => 9.90,
                'quantity'     => 2,
                'is_alcoholic' => false,
            ],
            [
                'name'         => 'Birra Moretti (0,33L)',
                'unit_price'   => 4.50,
                'quantity'     => 2,
                'is_alcoholic' => true,
            ],
        ];

        $result = $taxService->calculateTaxes($items);

        // Food gross = 19.80 €
        $this->assertEquals(19.80, $result['food_gross']);
        // Food net = 19.80 / 1.10 = 18.00 €
        $this->assertEquals(18.00, $result['food_net']);
        // Food VAT (10%) = 1.80 €
        $this->assertEquals(1.80, $result['food_vat_10']);

        // Drink gross = 9.00 €
        $this->assertEquals(9.00, $result['drink_gross']);
        // Drink net = 9.00 / 1.20 = 7.50 €
        $this->assertEquals(7.50, $result['drink_net']);
        // Drink VAT (20%) = 1.50 €
        $this->assertEquals(1.50, $result['drink_vat_20']);

        // Total amount = 28.80 €
        $this->assertEquals(28.80, $result['total_amount']);
        // Total VAT = 1.80 + 1.50 = 3.30 €
        $this->assertEquals(3.30, $result['total_vat']);
    }
}
