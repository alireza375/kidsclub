<?php

namespace App\Http\Resources\Admin;

use App\Models\BlogCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Safely fetch the category and handle missing categories
        $category = BlogCategory::find($this->category_id);

        // Safely fetch the author and handle missing author
        $author = User::find($this->user_id);

        return [
            'id' => $this->id,
            'user' => $this->user_id,
            'role' => $this->role == USER ? 'user' : ($this->role == COACH ? 'coach' : 'admin'),
            'title' => json_decode($this->title),
            'image' => $this->image,
            'details' => json_decode($this->details),
            'short_description' => json_decode($this->short_description),
            'category' => $category
                ? [
                    'id' => $category->id,
                    'name' => json_decode($category->name),
                ]
                : null,
            'author' => optional($author)->name,
            'add_to_popular' => $this->add_to_popular == 1,
            'published' => $this->publish == 1,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }


}
