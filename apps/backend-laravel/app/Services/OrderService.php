<?php

namespace App\Services;

use App\Models\MenuItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(
        protected TaxCalculationService $taxCalculationService
    ) {}

    /**
     * Creates an atomic takeaway order and computes Austrian VAT.
     */
    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $itemsPayload = $data['items'];
            $menuItemIds = collect($itemsPayload)->pluck('menu_item_id')->all();
            $menuItems = MenuItem::whereIn('id', $menuItemIds)->get()->keyBy('id');

            $preparedItems = [];
            foreach ($itemsPayload as $item) {
                $menuItem = $menuItems->get($item['menu_item_id']);
                if (!$menuItem || !$menuItem->is_available) {
                    throw ValidationException::withMessages([
                        'items' => ["Ein oder mehrere gewählte Artikel sind derzeit nicht verfügbar."],
                    ]);
                }

                $preparedItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'name'         => $menuItem->name,
                    'quantity'     => (int) $item['quantity'],
                    'unit_price'   => (float) $menuItem->base_price,
                    'tax_rate'     => (float) $menuItem->tax_rate,
                    'is_alcoholic' => (bool) $menuItem->is_alcoholic,
                ];
            }

            $taxResult = $this->taxCalculationService->calculateTaxes($preparedItems);

            // Generate unique sequential order number LN-YYYYMMDD-XXXX
            $today = date('Ymd');
            $randomSuffix = strtoupper(bin2hex(random_bytes(2)));
            $orderNumber = "LN-{$today}-{$randomSuffix}";

            $order = Order::create([
                'order_number'    => $orderNumber,
                'customer_name'   => $data['customer_name'],
                'customer_email'  => $data['customer_email'],
                'customer_phone'  => $data['customer_phone'],
                'pickup_time'     => $data['pickup_time'],
                'order_status'    => 'pending',
                'payment_status'  => 'unpaid',
                'payment_method'  => $data['payment_method'] ?? 'cash_on_pickup',
                'subtotal_amount' => $taxResult['subtotal'],
                'food_gross'      => $taxResult['food_gross'],
                'food_net'        => $taxResult['food_net'],
                'food_vat_10'     => $taxResult['food_vat_10'],
                'drink_gross'     => $taxResult['drink_gross'],
                'drink_net'       => $taxResult['drink_net'],
                'drink_vat_20'    => $taxResult['drink_vat_20'],
                'total_vat'       => $taxResult['total_vat'],
                'total_amount'    => $taxResult['total_amount'],
                'kitchen_notes'   => $data['kitchen_notes'] ?? null,
            ]);

            foreach ($preparedItems as $prepItem) {
                OrderItem::create([
                    'order_id'     => $order->id,
                    'menu_item_id' => $prepItem['menu_item_id'],
                    'quantity'     => $prepItem['quantity'],
                    'unit_price'   => $prepItem['unit_price'],
                    'line_total'   => round($prepItem['unit_price'] * $prepItem['quantity'], 2),
                    'tax_rate'     => $prepItem['tax_rate'],
                    'is_alcoholic' => $prepItem['is_alcoholic'],
                ]);
            }

            return $order->load('items.menuItem');
        });
    }

    /**
     * Formats receipt for 80mm ESC/POS thermal kitchen printers.
     */
    public function formatEscPosReceipt(Order $order): string
    {
        $divider = str_repeat('-', 42) . "\n";
        $doubleDivider = str_repeat('=', 42) . "\n";

        $output  = "\n";
        $output .= "       PIZZERIA LITTLE NAPOLI       \n";
        $output .= "   L'Autentica Pizza Napoletana     \n";
        $output .= " Hauptstraße 44, 2325 Himberg bei Wien \n";
        $output .= "       Tel: +43 2235 42733          \n";
        $output .= $doubleDivider;
        $output .= "BESTELLNUMMER: " . $order->order_number . "\n";
        $output .= "ABHOLZEIT:     " . $order->pickup_time->format('d.m.Y H:i') . "\n";
        $output .= "KUNDE:         " . $order->customer_name . "\n";
        $output .= "TEL:           " . $order->customer_phone . "\n";
        $output .= "ZAHLART:       " . strtoupper($order->payment_method) . "\n";
        $output .= $divider;
        $output .= sprintf("%-24s %3s %11s\n", "ARTIKEL", "MEN", "PREIS");
        $output .= $divider;

        foreach ($order->items as $item) {
            $itemName = substr($item->menuItem->name, 0, 24);
            $lineTotal = number_format((float)$item->line_total, 2, ',', '.') . " EUR";
            $output .= sprintf("%-24s %3d %11s\n", $itemName, $item->quantity, $lineTotal);
        }

        $output .= $divider;
        $output .= sprintf("%-28s %11s\n", "NETTO SPEISEN (10%):", number_format((float)$order->food_net, 2, ',', '.') . " EUR");
        $output .= sprintf("%-28s %11s\n", "UST 10% SPEISEN:", number_format((float)$order->food_vat_10, 2, ',', '.') . " EUR");
        if ($order->drink_gross > 0) {
            $output .= sprintf("%-28s %11s\n", "NETTO GETRÄNKE (20%):", number_format((float)$order->drink_net, 2, ',', '.') . " EUR");
            $output .= sprintf("%-28s %11s\n", "UST 20% GETRÄNKE:", number_format((float)$order->drink_vat_20, 2, ',', '.') . " EUR");
        }
        $output .= $divider;
        $output .= sprintf("%-28s %11s\n", "GESAMTBETRAG (BRUTTO):", number_format((float)$order->total_amount, 2, ',', '.') . " EUR");
        $output .= $doubleDivider;
        $output .= "   GRAZIE E BUON APPETITO!   \n\n\n";

        return $output;
    }
}
