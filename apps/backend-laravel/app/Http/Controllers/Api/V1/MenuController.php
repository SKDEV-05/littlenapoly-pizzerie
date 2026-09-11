<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\MenuItemResource;
use App\Models\Category;
use App\Models\MenuItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class MenuController extends Controller
{
    /**
     * Returns all menu categories with item counts.
     */
    public function categories(): AnonymousResourceCollection
    {
        $categories = Category::where('is_active', true)
            ->withCount(['menuItems' => fn ($query) => $query->where('is_available', true)])
            ->orderBy('sort_order', 'asc')
            ->get();

        return CategoryResource::collection($categories);
    }

    /**
     * Returns all active menu items with relations.
     */
    public function items(Request $request): AnonymousResourceCollection
    {
        $query = MenuItem::with(['category', 'allergens'])
            ->where('is_available', true);

        if ($categorySlug = $request->query('category_slug')) {
            $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
        }

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        $items = $query->orderBy('id', 'asc')->get();

        return MenuItemResource::collection($items);
    }

    /**
     * Returns details for a single menu item by slug.
     */
    public function show(string $slug): JsonResponse
    {
        $item = MenuItem::with(['category', 'allergens'])
            ->where('slug', $slug)
            ->where('is_available', true)
            ->firstOrFail();

        return (new MenuItemResource($item))->response();
    }

    /**
     * Upload an image for a menu item.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|file|image|mimes:jpeg,png,jpg,webp,avif|max:10240',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $filename = 'dish_' . time() . '_' . uniqid() . '.' . $extension;
            $path = $file->storeAs('menu', $filename, 'public');

            return response()->json([
                'success' => true,
                'path' => '/storage/' . $path,
                'url' => asset('storage/' . $path),
                'filename' => $filename,
            ], 201);
        }

        return response()->json(['error' => 'Keine Bilddatei übermittelt'], 400);
    }
}
