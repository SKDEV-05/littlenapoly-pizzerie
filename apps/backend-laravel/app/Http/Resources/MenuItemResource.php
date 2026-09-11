<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MenuItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'category_id'    => $this->category_id,
            'category_slug'  => $this->whenLoaded('category', fn () => $this->category->slug),
            'slug'           => $this->slug,
            'name'           => $this->name,
            'ingredients_de' => $this->ingredients_de,
            'ingredients_en' => $this->ingredients_en,
            'base_price'     => (float) $this->base_price,
            'tax_rate'       => (float) $this->tax_rate,
            'is_available'   => (bool) $this->is_available,
            'is_alcoholic'   => (bool) $this->is_alcoholic,
            'serving_size'   => $this->serving_size,
            'model_3d_key'   => $this->model_3d_key,
            'allergens'      => $this->whenLoaded('allergens', function () {
                return $this->allergens->map(fn ($allergen) => [
                    'code'        => $allergen->code,
                    'name_de'     => $allergen->name_de,
                    'name_en'     => $allergen->name_en,
                    'description' => $allergen->description_de,
                ]);
            }),
        ];
    }
}
