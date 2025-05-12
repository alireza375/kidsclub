<?php

namespace App\Http\Resources\Admin;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServiceNoticeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $service = Service::find($this->service_id);
        return [
            'id' => $this->id,
            'user' => [
                'id' => $this->user_id,
                'name' => optional($this->user)->name ?? 'Unknown User',
            ],
            'role' => $this->user_role === 1
                ? 'user'
                : ($this->user_role === 2 ? 'coach' : 'admin'),
            'service' => [
                'id' => $this->service_id,
                'name' => json_decode($service->name),
            ],
            'title' => json_decode($this->title) ?? '',
            'description' => json_decode($this->description) ?? '',
            'created_at' => $this->created_at ? $this->created_at->toISOString() : null,
            'updated_at' => $this->updated_at ? $this->updated_at->toISOString() : null,
        ];
    }
}
