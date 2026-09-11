<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $emailRule = app()->environment('testing') ? 'email:rfc' : 'email:rfc,dns';

        return [
            'guest_name'       => ['required', 'string', 'min:2', 'max:100'],
            'guest_email'      => ['required', $emailRule],
            'guest_phone'      => ['required', 'string', 'regex:/^(\+43|0)[1-9][0-9]{3,12}$/'],
            'party_size'       => ['required', 'integer', 'min:1', 'max:20'],
            'reserved_date'    => ['required', 'date', 'after_or_equal:today'],
            'time_slot'        => ['required', 'string', 'regex:/^(1[1-9]|2[0-1]):(00|15|30|45)$/'], // 11:00 to 21:45
            'special_requests' => ['nullable', 'string', 'max:500'],
        ];
    }

    public function messages(): array
    {
        return [
            'guest_phone.regex' => 'Bitte geben Sie eine gültige Telefonnummer im österreichischen Format an.',
            'time_slot.regex'   => 'Reservierungszeiten sind im 15-Minuten-Takt zwischen 11:00 und 21:45 Uhr möglich.',
        ];
    }
}
