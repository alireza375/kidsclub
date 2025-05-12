<?php

namespace App\Http\Resources\Common;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
       
        // Map through the comments to structure the data
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user?->id,
                'name' => $this->user?->name, // Safe navigation operator (in case 'user' is null)
                'email' => $this->user?->email,
                'image' => $this->user?->image, // Assuming 'image' is a field in the users table
            ],
            'content' => $this->content, // Assuming 'comment' field is the content of the comment
            'created_at' => $this->created_at->toDateTimeString(),
            'replies' => BlogCommentResource::collection($this->whenLoaded('replies')), // Recursive replies
        ];

    }

}
