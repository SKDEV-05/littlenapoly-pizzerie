<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReservationRequest;
use App\Http\Resources\ReservationResource;
use App\Models\Reservation;
use App\Services\ReservationService;
use Illuminate\Http\JsonResponse;

class ReservationController extends Controller
{
    public function __construct(
        protected ReservationService $reservationService
    ) {}

    /**
     * Stores a table reservation with concurrency conflict prevention.
     */
    public function store(StoreReservationRequest $request): JsonResponse
    {
        $reservation = $this->reservationService->makeReservation($request->validated());

        return (new ReservationResource($reservation))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Shows a reservation by unique reservation code.
     */
    public function show(string $reservationCode): JsonResponse
    {
        $reservation = Reservation::with('diningTable')
            ->where('reservation_code', $reservationCode)
            ->firstOrFail();

        return (new ReservationResource($reservation))->response();
    }
}
