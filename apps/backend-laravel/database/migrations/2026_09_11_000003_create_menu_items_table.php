<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('ingredients_de');
            $table->text('ingredients_en')->nullable();
            $table->decimal('base_price', 8, 2);
            $table->decimal('tax_rate', 5, 2)->default(10.00); // 10.00% or 20.00% (Austrian UStG)
            $table->boolean('is_available')->default(true);
            $table->boolean('is_alcoholic')->default(false);
            $table->string('serving_size')->nullable(); // e.g. "350g", "0,33L", "0,5L"
            $table->string('model_3d_key')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['category_id', 'is_available']);
            $table->index('slug');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_items');
    }
};
