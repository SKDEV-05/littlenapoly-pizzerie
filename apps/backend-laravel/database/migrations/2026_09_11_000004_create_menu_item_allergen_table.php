<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('menu_item_allergen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_item_id')->constrained('menu_items')->onDelete('cascade');
            $table->string('allergen_code', 2);
            $table->foreign('allergen_code')->references('code')->on('allergens')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['menu_item_id', 'allergen_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('menu_item_allergen');
    }
};
