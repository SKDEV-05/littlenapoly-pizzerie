<?php

use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name'        => "Little Napoli - L'Autentica Pizza Napoletana API Engine",
        'version'     => '1.0.0',
        'location'    => 'Hauptstraße 44, 2325 Himberg bei Wien, Austria',
        'health'      => url('/api/v1/health'),
        'menu'        => url('/api/v1/menu/items'),
        'categories'  => url('/api/v1/menu/categories'),
        'status'      => 'operational',
        'deploy_tools' => [
            'status'         => url('/deploy-status'),
            'migrate_seed'   => url('/deploy-migrate-seed'),
            'storage_link'   => url('/deploy-storage-link'),
            'clear_cache'    => url('/deploy-clear-cache'),
        ],
    ]);
});

// Deployment Diagnostic Endpoint (for InfinityFree / cPanel verification)
Route::get('/deploy-status', function () {
    $dbOk = false;
    $dbError = null;
    $dishCount = 0;
    $categoryCount = 0;

    try {
        DB::connection()->getPdo();
        $dbOk = true;
        $dishCount = MenuItem::count();
        $categoryCount = Category::count();
    } catch (\Throwable $e) {
        $dbError = $e->getMessage();
    }

    $storageWritable = is_writable(storage_path());
    $cacheWritable = is_writable(base_path('bootstrap/cache'));

    return response()->json([
        'environment' => app()->environment(),
        'php_version' => PHP_VERSION,
        'app_key_set' => !empty(config('app.key')),
        'database' => [
            'connected'       => $dbOk,
            'connection_name' => config('database.default'),
            'database_name'   => config('database.connections.'.config('database.default').'.database'),
            'host'            => config('database.connections.'.config('database.default').'.host'),
            'dishes_count'    => $dishCount,
            'categories_count'=> $categoryCount,
            'error'           => $dbError,
        ],
        'permissions' => [
            'storage_writable'         => $storageWritable,
            'bootstrap_cache_writable' => $cacheWritable,
        ],
        'cors_allowed_origins' => config('cors.allowed_origins'),
    ]);
});

// Database Migration & Seeding Endpoint
Route::get('/deploy-migrate-seed', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = Artisan::output();

        Artisan::call('db:seed', ['--force' => true]);
        $seedOutput = Artisan::output();

        $dishes = MenuItem::count();
        $categories = Category::count();

        return response()->json([
            'success'          => true,
            'message'          => 'Datenbank erfolgreich migriert und mit Speisen befüllt!',
            'categories_count' => $categories,
            'dishes_count'     => $dishes,
            'migrate_log'      => $migrateOutput,
            'seed_log'         => $seedOutput,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'message' => 'Migration fehlgeschlagen!',
            'error'   => $e->getMessage(),
        ], 500);
    }
});

// Storage Link Creation Endpoint
Route::get('/deploy-storage-link', function () {
    try {
        // Attempt standard storage:link
        Artisan::call('storage:link');
        $output = Artisan::output();

        return response()->json([
            'success' => true,
            'message' => 'Storage-Link erfolgreich verknüpft!',
            'output'  => $output,
        ]);
    } catch (\Throwable $e) {
        // Fallback for hosts where symlink() is disabled
        $publicStorage = public_path('storage');
        $targetStorage = storage_path('app/public');

        if (!File::exists($publicStorage)) {
            File::makeDirectory($publicStorage, 0755, true, true);
        }

        return response()->json([
            'success' => true,
            'message' => 'Storage-Verzeichnis direkt eingerichtet (Fallback für eingeschränkte Symlinks).',
            'details' => $e->getMessage(),
        ]);
    }
});

// Cache Clearing Endpoint (resets cached config when .env changes)
Route::get('/deploy-clear-cache', function () {
    try {
        Artisan::call('optimize:clear');
        $output = Artisan::output();

        return response()->json([
            'success' => true,
            'message' => 'Cache, Routen und Configs erfolgreich bereinigt!',
            'output'  => $output,
        ]);
    } catch (\Throwable $e) {
        return response()->json([
            'success' => false,
            'error'   => $e->getMessage(),
        ], 500);
    }
});
