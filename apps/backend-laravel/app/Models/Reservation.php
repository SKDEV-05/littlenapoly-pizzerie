<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'dining_table_id',
        'reservation_code',
        'guest_name',
        'guest_email',
        'guest_phone',
        'party_size',
        'reserved_date',
        'time_slot',
        'status',
        'special_requests',
    ];

    protected $casts = [
        'party_size' => 'integer',
        'reserved_date' => 'date',
    ];

    public function diningTable(): BelongsTo
    {
        return $this->belongsTo(DiningTable::class);
    }
}
