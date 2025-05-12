<?php

namespace App\Http\Resources\Admin;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogCategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            "name" => json_decode($this->name),
            'total' => Blog::where('category_id', $this->id)->count(),
            "created_at" => $this->created_at,
            "updated_at" => $this->updated_at
        ];
    }
}
