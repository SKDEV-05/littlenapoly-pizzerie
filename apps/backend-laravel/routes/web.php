<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message'  => "Little Napoli - L'Autentica Pizza Napoletana API Engine",
        'location' => 'Hauptstraße 44, 2325 Himberg bei Wien, Austria',
        'docs'     => '/api/v1/health',
        'status'   => 'operational',
    ]);
});
