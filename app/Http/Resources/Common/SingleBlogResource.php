<?php

namespace App\Http\Resources\Common;

use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SingleBlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $comments = BlogCommentResource::collection(BlogComment::where('blog_id', $this->id)->get());
        return [
            'id' => $this->id,
            'title' => json_decode($this->title),
            'image' => $this->image,
            'details' => json_decode($this->details),
            'short_description' => json_decode($this->short_description),
            'category' => [
                'id' => $this->category_id,
                'name' => json_decode(BlogCategory::find($this->category_id)->name)
            ],
            'add_to_popular' => $this->add_to_popular == 1,
            'published' => $this->publish == 1,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'comments' => $comments,
        ];

    }
}
