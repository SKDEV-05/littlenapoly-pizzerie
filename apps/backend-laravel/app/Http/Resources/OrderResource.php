<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'order_number'    => $this->order_number,
            'customer_name'   => $this->customer_name,
            'customer_email'  => $this->customer_email,
            'customer_phone'  => $this->customer_phone,
            'pickup_time'     => $this->pickup_time->toIso8601String(),
            'order_status'    => $this->order_status,
            'payment_status'  => $this->payment_status,
            'payment_method'  => $this->payment_method,
            'financials'      => [
                'subtotal'     => (float) $this->subtotal_amount,
                'food_gross'   => (float) $this->food_gross,
                'food_net'     => (float) $this->food_net,
                'food_vat_10'  => (float) $this->food_vat_10,
                'drink_gross'  => (float) $this->drink_gross,
                'drink_net'    => (float) $this->drink_net,
                'drink_vat_20' => (float) $this->drink_vat_20,
                'total_vat'    => (float) $this->total_vat,
                'total_amount' => (float) $this->total_amount,
                'currency'     => 'EUR',
            ],
            'kitchen_notes'   => $this->kitchen_notes,
            'items'           => $this->whenLoaded('items', function () {
                return $this->items->map(fn ($item) => [
                    'id'           => $item->id,
                    'menu_item_id' => $item->menu_item_id,
                    'name'         => $item->menuItem ? $item->menuItem->name : null,
                    'quantity'     => $item->quantity,
                    'unit_price'   => (float) $item->unit_price,
                    'line_total'   => (float) $item->line_total,
                    'tax_rate'     => (float) $item->tax_rate,
                    'is_alcoholic' => (bool) $item->is_alcoholic,
                ]);
            }),
            'created_at'      => $this->created_at->toIso8601String(),
        ];
    }
}
