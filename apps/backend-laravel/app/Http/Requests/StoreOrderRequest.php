<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $emailRule = app()->environment('testing') ? 'email:rfc' : 'email:rfc,dns';

        return [
            'customer_name'  => ['required', 'string', 'min:2', 'max:100'],
            'customer_email' => ['required', $emailRule],
            // Strict Austrian phone validation (+43 or leading 0 followed by area/mobile code)
            'customer_phone' => ['required', 'string', 'regex:/^(\+43|0)[1-9][0-9]{3,12}$/'],
            'pickup_time'    => ['required', 'date', 'after:now'],
            'payment_method' => ['required', 'in:cash_on_pickup,stripe_online'],
            'kitchen_notes'  => ['nullable', 'string', 'max:500'],
            'items'          => ['required', 'array', 'min:1'],
            'items.*.menu_item_id' => ['required', 'integer', 'exists:menu_items,id'],
            'items.*.quantity'     => ['required', 'integer', 'min:1', 'max:50'],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_phone.regex' => 'Bitte geben Sie eine gültige Telefonnummer im österreichischen Format an (z.B. +43 676 1234567 oder 0676 1234567).',
            'pickup_time.after'    => 'Die gewünschte Abholzeit muss in der Zukunft liegen.',
            'items.min'            => 'Ihr Warenkorb muss mindestens einen Artikel enthalten.',
        ];
    }
}
