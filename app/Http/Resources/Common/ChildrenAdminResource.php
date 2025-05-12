<?php

namespace App\Http\Resources\Common;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChildrenAdminResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Load the user using the user_id, assuming there is a relationship defined
        $user = $this->user; // assuming you have a 'user' relationship defined in the Children model

        $services = [];
        if ($this->service_id) {
            $serviceIds = is_string($this->service_id) ? json_decode($this->service_id, true) : $this->service_id;

            // Ensure service IDs are in array format
            if (is_array($serviceIds)) {
                $services = Service::whereIn('id', $serviceIds)->get(['name'])->map(function ($service) {
                    // Decode the JSON stored in the 'name' field
                    return json_decode($service->name, true);
                })->toArray();
            }
        }

        return [
            'id' => $this->id,
            'name' => $this->name,
            'parent' => [
                'name' => $user->name ?? null,
                'email' => $user->email ?? null,
                'phone' => $user->phone ?? null,
                'image' => $user->image ?? null,
            ],
            'dob' => $this->dob,
            'relation_type' => $this->relation_type,
            'image' => $this->image,
            'service' => $services,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
