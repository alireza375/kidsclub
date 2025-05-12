<?php

namespace App\Http\Resources\Common;

use App\Models\BlogCategory;
use App\Models\BlogComment;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TrainerResource extends JsonResource
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
            'name' => $this->name,
            'image' => $this->image,
            'about' => $this->about,
            'description' => $this->description,
            'facebook' => $this->facebook,
            'instagram' => $this->instagram,
            'twitter' => $this->twitter,
            'linkedin' => $this->linkedin,
            'education' => $this->education,
            'experience' => $this->experience,
            'skill' => $this->skill,
            'achievement' => $this->achievement,
            'philosophy' => $this->philosophy,
        ];

    }
}
