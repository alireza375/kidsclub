<?php

namespace App\Http\Resources\Common;

use App\Models\Children;
use App\Models\Currency;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserEnrollResourse extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request)
    {
        $currency_symbol = Currency::where('code', $this->currency)->first()->symbol;

        $child = $this->child_id ? Children::find($this->child_id) : null;
        $review = Review::where('service_id', $this->service_id)
            ->where('user_id', $this->user_id)->first();

        $data =  [
            'id' => $this->id,
            'service' => [
                'id' => $this->service_id,
                'name' => json_decode($this->service->name) ?? [],
                'title' => json_decode($this->service->title) ?? [],
                'image' => $this->service->image,
                'price' => $this->service->price,
                'description' => json_decode($this->service->description) ?? [],
            ],

            'review' => $review,
            'currency' => $currency_symbol,
            'price' => $this->total,
            'status' => $this->status,
            'is_paid' => $this->is_paid == 1 ? true : false,

        ];

        if ($child) {
            $data['child'] = [
                'id' => $child->id,
                'name' => $child->name,
                'email' => $child->email,
                'phone' => $child->phone,
            ];
        }

        return $data;
    }
}
