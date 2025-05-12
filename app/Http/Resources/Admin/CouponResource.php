<?php

namespace App\Http\Resources\Admin;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'discount' => intval($this->discount),
            'type' => $this->type,
            'usage_limit_per_user' => $this->usage_limit_per_user,
            'minimum_order_amount' => intval($this->minimum_order_amount),
            'expire_at' => $this->expire_at,
            'status' => $this->status == 1 ? true : false,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
