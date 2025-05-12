<?php

namespace App\Http\Resources\Common;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReplyCommentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = User::find($this->user_id);
        return [
            'id' => $this->id,
            'blog' => $this->blog_id,
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'image' => $user->image, // Assuming 'profile_image' field exists in user table
            ],
            'content' => $this->content,
            'parent_comment' => $this->parent_id,
        ];
    }
}
