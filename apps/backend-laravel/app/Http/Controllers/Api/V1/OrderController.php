<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class OrderController extends Controller
{
    public function __construct(
        protected OrderService $orderService
    ) {}

    /**
     * Stores a new customer takeaway order.
     */
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->createOrder($request->validated());

        return (new OrderResource($order))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Retrieves an order by order number.
     */
    public function show(string $orderNumber): JsonResponse
    {
        $order = Order::with('items.menuItem')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        return (new OrderResource($order))->response();
    }

    /**
     * Returns raw 80mm ESC/POS thermal printer receipt text.
     */
    public function printReceipt(string $orderNumber): Response
    {
        $order = Order::with('items.menuItem')
            ->where('order_number', $orderNumber)
            ->firstOrFail();

        $receiptText = $this->orderService->formatEscPosReceipt($order);

        return response($receiptText, 200, [
            'Content-Type'        => 'text/plain; charset=utf-8',
            'Content-Disposition' => "inline; filename=\"receipt-{$order->order_number}.txt\"",
        ]);
    }
}
