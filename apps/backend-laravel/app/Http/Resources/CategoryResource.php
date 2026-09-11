<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'slug'           => $this->slug,
            'name_de'        => $this->name_de,
            'name_en'        => $this->name_en,
            'description_de' => $this->description_de,
            'description_en' => $this->description_en,
            'sort_order'     => $this->sort_order,
            'items_count'    => $this->whenCounted('menuItems'),
            'items'          => MenuItemResource::collection($this->whenLoaded('menuItems')),
        ];
    }
}
