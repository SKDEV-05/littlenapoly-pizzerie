<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'reservation_code' => $this->reservation_code,
            'guest_name'       => $this->guest_name,
            'guest_email'      => $this->guest_email,
            'guest_phone'      => $this->guest_phone,
            'party_size'       => $this->party_size,
            'reserved_date'    => $this->reserved_date->format('Y-m-d'),
            'time_slot'        => $this->time_slot,
            'status'           => $this->status,
            'table_number'     => $this->diningTable ? $this->diningTable->table_number : null,
            'special_requests' => $this->special_requests,
            'created_at'       => $this->created_at->toIso8601String(),
        ];
    }
}
