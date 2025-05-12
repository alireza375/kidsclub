<?php

namespace App\Http\Resources\Common;

use App\Models\Package;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BuyPackageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $package = Package::find($this->package_id);
        $serviceIds = json_decode($package->service_id, true);
        $services = Service::whereIn('id', $serviceIds)->pluck('name')->map(function ($name) {
            return json_decode($name, true);
        })->toArray();
        return [
            'id' => $this->id,
            'package_id' => [
                'id' => $package->id,
                'name' => json_decode($package->name),
                'my_services' => $services,
                'image' => $package->image,
                'price' => $package->price,
                'is_active' => $package->is_active,
            ],
            'currency' => $this->currency,
            'price' => $this->total,
            'status' => $this->status,
            'method' => $this->method,
            'is_paid' => $this->is_paid == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
