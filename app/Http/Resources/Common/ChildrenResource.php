<?php

namespace App\Http\Resources\Common;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChildrenResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // totat assign service in children
        $service = $this->service_id;
        $service = is_string($service) ? json_decode($service, true) : $service;
        $service = is_array($service) ? count($service) : 0;
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'dob' => $this->dob,
            'relation_type' => $this->relation_type,
            'image' => $this->image,
            'service_id' => is_string($this->service_id) ? json_decode($this->service_id, true) : $this->service_id,
            'total_service' => $service,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
