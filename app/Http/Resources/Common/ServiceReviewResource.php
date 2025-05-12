<?php

namespace App\Http\Resources\Common;

use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $service = Service::find($this->service_id);
        $user = User::find($this->user_id);
        return [
            'id' => $this->id,
            'service_id' => [
                'id' => $service->id,
                'name' => json_decode($service->name),
            ],
            'user_id' => [
                'id' => $user->id,
                'name' => $user->name,
                'image' => $user->image
            ],
            'rating' => $this->rating,
            'comment' => $this->comment,
            'status' => $this->status == 1 ? true : false
        ];
    }
}
