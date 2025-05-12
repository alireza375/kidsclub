<?php

namespace App\Http\Resources\Common;

use App\Models\Children;
use App\Models\EnrollService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChildrenTrainerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Get the service for the current EnrollService model (this->id)
        $service = Service::find($this->id);

        // Fetch all EnrollService records where the service_id matches this service
        $enrolledChildren = EnrollService::where('service_id', $this->id)->get();

        // Initialize an empty array to store children details
        $childrenData = null;

        // Loop through each EnrollService record to fetch the associated child
        foreach ($enrolledChildren as $enroll) {
            $child = Children::find($enroll->child_id);

            if ($child) {
                $childrenData = [
                    'id' => $child->id,
                    'name' => $child->name,
                    'dob' => $child->dob,
                    'relation_type' => $child->relation_type,
                    'image' => $child->image,
                    'parent' => [
                        'name' => $child->user->name ?? null,
                        'email' => $child->user->email ?? null,
                        'phone' => $child->user->phone ?? null,
                        'image' => $child->user->image ?? null,
                    ]
                ];
                break;
            }
        }

        // Return the transformed data
        return [
            'children' => $childrenData, // Single object or null
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}