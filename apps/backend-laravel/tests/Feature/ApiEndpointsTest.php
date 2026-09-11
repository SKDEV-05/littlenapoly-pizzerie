<?php

namespace Tests\Feature;

use App\Models\MenuItem;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    /**
     * Test Health endpoint responds successfully with system metrics.
     */
    public function test_health_check_endpoint(): void
    {
        $response = $this->getJson('/api/v1/health');

        $response->assertStatus(200)
            ->assertJson([
                'status'  => 'ok',
                'service' => 'Little Napoli Laravel API Engine',
                'version' => '1.0.0',
            ])
            ->assertJsonStructure([
                'status',
                'service',
                'version',
                'timestamp',
                'components' => ['database', 'storage'],
                'business'   => ['name', 'location', 'phone'],
            ]);
    }

    /**
     * Test Menu categories endpoint returns Neapolitan pizza categories.
     */
    public function test_menu_categories_endpoint(): void
    {
        $response = $this->getJson('/api/v1/menu/categories');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name_de', 'name_en', 'slug'],
                ],
            ]);
    }

    /**
     * Test Menu items endpoint returns pizzas with ingredients and prices.
     */
    public function test_menu_items_endpoint(): void
    {
        $response = $this->getJson('/api/v1/menu/items');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'slug', 'base_price'],
                ],
            ]);
    }

    /**
     * Test Table reservation creation and retrieval.
     */
    public function test_reservation_creation_and_retrieval(): void
    {
        $payload = [
            'guest_name'       => 'Marco Rossi',
            'guest_email'      => 'marco@littlenapoli.at',
            'guest_phone'      => '+436601234567',
            'party_size'       => 2,
            'reserved_date'    => now()->addDays(2)->format('Y-m-d'),
            'time_slot'        => '19:00',
            'special_requests' => 'Quiet corner table please',
        ];

        $createResponse = $this->postJson('/api/v1/reservations', $payload);

        $createResponse->assertStatus(201)
            ->assertJsonStructure([
                'data' => ['reservation_code', 'guest_name', 'party_size', 'status'],
            ]);

        $code = $createResponse->json('data.reservation_code');

        $showResponse = $this->getJson("/api/v1/reservations/{$code}");
        $showResponse->assertStatus(200)
            ->assertJsonPath('data.guest_name', 'Marco Rossi');
    }

    /**
     * Test Takeaway Order creation and receipt printing.
     */
    public function test_order_creation_and_receipt(): void
    {
        $pizza = MenuItem::first();

        $payload = [
            'customer_name'  => 'Giulia Bianchi',
            'customer_email' => 'giulia@littlenapoli.at',
            'customer_phone' => '+436769876543',
            'pickup_time'    => now()->addHour()->format('Y-m-d H:i:s'),
            'payment_method' => 'cash_on_pickup',
            'kitchen_notes'  => 'Extra basil on pizza please',
            'items'          => [
                [
                    'menu_item_id' => $pizza->id,
                    'quantity'     => 2,
                ],
            ],
        ];

        $orderResponse = $this->postJson('/api/v1/orders', $payload);

        $orderResponse->assertStatus(201)
            ->assertJsonStructure([
                'data' => [
                    'order_number',
                    'customer_name',
                    'order_status',
                    'financials' => ['total_amount', 'subtotal', 'total_vat'],
                ],
            ]);

        $orderNumber = $orderResponse->json('data.order_number');

        $receiptResponse = $this->get("/api/v1/orders/{$orderNumber}/receipt");
        $receiptResponse->assertStatus(200);
        $receiptResponse->assertSee('LITTLE NAPOLI');
    }
}
