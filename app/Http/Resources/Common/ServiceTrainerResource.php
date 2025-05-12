<?php

namespace App\Http\Resources\Common;

use App\Models\Children;
use App\Models\EnrollService;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use function Pest\Laravel\json;

class ServiceTrainerResource extends JsonResource
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
        return [
            'id' => $this->id,
            'name' => json_decode($service->name),
            'title' => json_decode($service->title),
            'description' => json_decode($service->description),
            'image' => $service->image,
            'category' => json_decode($service->category),
            'session' => $service->session,
            'duration' => $service->duration,
            'is_active' => $service->is_active == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

