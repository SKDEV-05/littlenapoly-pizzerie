<?php

namespace App\Services;

use App\Models\DiningTable;
use App\Models\Reservation;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReservationService
{
    /**
     * Reserves a dining table using pessimistic locking to prevent double bookings.
     */
    public function makeReservation(array $data): Reservation
    {
        return DB::transaction(function () use ($data) {
            $partySize = (int) $data['party_size'];
            $reservedDate = $data['reserved_date'];
            $timeSlot = $data['time_slot'];

            // Find an available table capable of seating the party
            $availableTable = DiningTable::where('capacity', '>=', $partySize)
                ->where('is_active', true)
                ->whereDoesntHave('reservations', function ($query) use ($reservedDate, $timeSlot) {
                    $query->where('reserved_date', $reservedDate)
                          ->where('time_slot', $timeSlot)
                          ->whereIn('status', ['confirmed', 'seated']);
                })
                ->orderBy('capacity', 'asc')
                ->lockForUpdate()
                ->first();

            if (!$availableTable) {
                throw ValidationException::withMessages([
                    'time_slot' => ["Zur gewünschten Uhrzeit ({$timeSlot} am {$reservedDate}) ist leider kein Tisch für {$partySize} Personen verfügbar."],
                ]);
            }

            // Generate unique human-readable reservation code
            $reservationCode = 'RES-' . strtoupper(bin2hex(random_bytes(3)));

            return Reservation::create([
                'dining_table_id'  => $availableTable->id,
                'reservation_code' => $reservationCode,
                'guest_name'       => $data['guest_name'],
                'guest_email'      => $data['guest_email'],
                'guest_phone'      => $data['guest_phone'],
                'party_size'       => $partySize,
                'reserved_date'    => $reservedDate,
                'time_slot'        => $timeSlot,
                'status'           => 'confirmed',
                'special_requests' => $data['special_requests'] ?? null,
            ]);
        });
    }
}
