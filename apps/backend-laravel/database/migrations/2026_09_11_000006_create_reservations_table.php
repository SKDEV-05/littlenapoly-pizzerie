<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dining_table_id')->nullable()->constrained('dining_tables')->onDelete('set null');
            $table->string('reservation_code')->unique();
            $table->string('guest_name');
            $table->string('guest_email');
            $table->string('guest_phone');
            $table->integer('party_size');
            $table->date('reserved_date');
            $table->string('time_slot'); // e.g. "18:00", "19:30"
            $table->string('status')->default('confirmed'); // confirmed, seated, cancelled, no_show
            $table->text('special_requests')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['reserved_date', 'time_slot', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
