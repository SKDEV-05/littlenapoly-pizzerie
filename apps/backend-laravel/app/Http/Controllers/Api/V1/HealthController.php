<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    /**
     * Deep liveness and readiness probe for database and disk storage.
     */
    public function check(): JsonResponse
    {
        $dbStatus = 'healthy';
        try {
            DB::connection()->getPdo();
        } catch (\Throwable $e) {
            $dbStatus = 'unreachable: ' . $e->getMessage();
        }

        $status = ($dbStatus === 'healthy') ? 'ok' : 'degraded';
        $httpCode = ($status === 'ok') ? 200 : 503;

        return response()->json([
            'status'     => $status,
            'service'    => 'Little Napoli Laravel API Engine',
            'version'    => '1.0.0',
            'timestamp'  => now()->toIso8601String(),
            'components' => [
                'database' => $dbStatus,
                'storage'  => is_writable(storage_path()) ? 'writable' : 'read-only',
            ],
            'business'   => [
                'name'     => "Little Napoli - L'Autentica Pizza Napoletana",
                'location' => 'Hauptstraße 44, 2325 Himberg bei Wien',
                'phone'    => '+43 2235 42733',
            ],
        ], $httpCode);
    }
}
