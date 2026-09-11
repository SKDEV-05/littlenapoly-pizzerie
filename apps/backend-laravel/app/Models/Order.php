<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number',
        'customer_name',
        'customer_email',
        'customer_phone',
        'pickup_time',
        'order_status',
        'payment_status',
        'payment_method',
        'stripe_payment_intent_id',
        'subtotal_amount',
        'food_gross',
        'food_net',
        'food_vat_10',
        'drink_gross',
        'drink_net',
        'drink_vat_20',
        'total_vat',
        'total_amount',
        'kitchen_notes',
    ];

    protected $casts = [
        'pickup_time' => 'datetime',
        'subtotal_amount' => 'decimal:2',
        'food_gross' => 'decimal:2',
        'food_net' => 'decimal:2',
        'food_vat_10' => 'decimal:2',
        'drink_gross' => 'decimal:2',
        'drink_net' => 'decimal:2',
        'drink_vat_20' => 'decimal:2',
        'total_vat' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
