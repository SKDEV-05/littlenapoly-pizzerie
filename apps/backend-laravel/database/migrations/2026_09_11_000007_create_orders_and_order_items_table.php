<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->dateTime('pickup_time');
            $table->string('order_status')->default('pending'); // pending, in_preparation, ready, completed, cancelled
            $table->string('payment_status')->default('unpaid'); // unpaid, paid, refunded
            $table->string('payment_method')->default('cash_on_pickup'); // cash_on_pickup, stripe_online
            $table->string('stripe_payment_intent_id')->nullable();

            // Fiscal amounts in EUR
            $table->decimal('subtotal_amount', 8, 2);
            $table->decimal('food_gross', 8, 2)->default(0.00);
            $table->decimal('food_net', 8, 2)->default(0.00);
            $table->decimal('food_vat_10', 8, 2)->default(0.00); // 10% VAT
            $table->decimal('drink_gross', 8, 2)->default(0.00);
            $table->decimal('drink_net', 8, 2)->default(0.00);
            $table->decimal('drink_vat_20', 8, 2)->default(0.00); // 20% VAT
            $table->decimal('total_vat', 8, 2)->default(0.00);
            $table->decimal('total_amount', 8, 2);

            $table->text('kitchen_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['order_status', 'created_at']);
            $table->index('order_number');
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('restrict');
            $table->integer('quantity')->default(1);
            $table->decimal('unit_price', 8, 2);
            $table->decimal('line_total', 8, 2);
            $table->decimal('tax_rate', 5, 2); // 10.00 or 20.00
            $table->boolean('is_alcoholic')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
