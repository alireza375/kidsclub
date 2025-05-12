<?php

namespace App\Http\Resources\Admin;

use App\Models\Currency;
use App\Models\EnrollService;
use App\Models\Review;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PakageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $serviceIds = json_decode($this->service_id, true);

        // Fetch service names and decode each one
        $serviceNames = Service::whereIn('id', $serviceIds)
        ->get(['id', 'name']) // Fetch only the 'id' and 'name' columns
        ->map(function ($service) {
            return [
                'id' => $service->id,
                'name' => json_decode($service->name, true), // Decode JSON if needed
            ];
        })->toArray();

        $currencySymbol = Currency::where('default', 1)->first();


        return [
            'id' => $this->id,
            'name' => json_decode($this->name, true),
            'service_id' => $serviceNames,
            'price' => floatval($this->price),
            'currencySymbol' => $currencySymbol->symbol,
            'image' => $this->image,
            'is_active' => $this->is_active == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }


}
