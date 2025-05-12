<?php

namespace App\Http\Resources\Common;

use App\Http\Requests\ProductReviewRequest;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductReviewResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $product = ProductReview::with('product')->where('id', $this->id)->first();
        $user = User::find($this->user_id);
        return [
            'id' => $this->id,
            'product' => [
                'id' => $product->product->id,
                'name' => json_decode($product->product->name),
                'price' => $product->product->price,
                'image' => $product->product->image,
            ],
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'image' => $user->image
            ],
            'rating' => $this->rating,
            'comment' => $this->comment,
            'status' => $this->status == 1 ? true : false
        ];
    }
}
