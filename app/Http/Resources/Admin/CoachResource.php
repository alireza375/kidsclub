<?php

namespace App\Http\Resources\Admin;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CoachResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Fetch the first matching service
        $assignedService = Service::where('instructor_id', $this->id)->first();

        return [
            'id' => $this->id,
            'uid' => $this->uid ?? null,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->getRoleName(),
            'assigned_service' => $assignedService ? [
                'id' => $assignedService->id,
                'name' => json_decode($assignedService->name),
            ] : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'image' => $this->image ?? null,
            'status' => (bool) $this->status,
            'address' => $this->address ?? null,
            'skills' => $this->skills ? json_decode($this->skills) : [],
            'about' => $this->about ?? null,
            'position' => $this->position ?? null,
            'experience' => $this->experience ?? null,
            'description' => $this->description ?? null,
            'facebook' => $this->facebook ?? null,
            'instagram' => $this->instagram ?? null,
            'twitter' => $this->twitter ?? null,
            'linkedin' => $this->linkedin ?? null,
        ];
    }


    /**
     * Get the human-readable role name.
     *
     * @return string
     */
    protected function getRoleName(): string
    {
        switch ($this->role) {
            case USER:
                return 'user';
            case COACH:
                return 'coach';
            default:
                return 'admin';
        }
    }
}
