<?php

namespace App\Http\Resources\Trainer;

use App\Models\BlogCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainerBlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        {
            // Handle category
            $category = BlogCategory::find($this->category_id);
            $categoryData = $category ? [
                'id' => $category->id,
                'name' => json_decode($category->name)
            ] : null; // Use null if category not found

            // Return response
            return [
                'id' => $this->id,
                'user' => $this->user_id,
                'title' => json_decode($this->title),
                'image' => $this->image,
                'details' => json_decode($this->details),
                'short_description' => json_decode($this->short_description),
                'category' => $categoryData, // Safe category handling
                'add_to_popular' => $this->add_to_popular == 1,
                'published' => $this->publish == 1,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at
            ];
        }
    }
}
