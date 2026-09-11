<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DiningTable extends Model
{
    protected $fillable = [
        'table_number',
        'capacity',
        'is_indoor',
        'is_active',
    ];

    protected $casts = [
        'table_number' => 'integer',
        'capacity' => 'integer',
        'is_indoor' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
