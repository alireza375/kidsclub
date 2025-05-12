<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Common\ProductReviewResource;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SingleProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */

    public function toArray($request)
    {

        // Fetch related products from the same category, excluding the current product
        $relatedProducts = Product::where('id', '!=', $this->id)
            ->where('is_active', 1)
            ->where('publish', 1)
            ->limit(4)
            ->get();

        $reviews = ProductReview::where('product_id', $this->id)->get();
        $ratingCounts = [
            'one_star' => $reviews->where('rating', 1)->count(),
            'two_star' => $reviews->where('rating', 2)->count(),
            'three_star' => $reviews->where('rating', 3)->count(),
            'four_star' => $reviews->where('rating', 4)->count(),
            'five_star' => $reviews->where('rating', 5)->count(),
        ];
        if ($this->discount_type == "percentage") {
            $discountprice = $this->price - ($this->price * ($this->discount / 100));
        } else {
            $discountprice = $this->price - $this->discount;
        }
        $avr = ProductReview::where('product_id', $this->id)->avg('rating');
        return [
            'product' => [
                'id' => $this->id,
                'name' => json_decode($this->name),
                'discount' => $this->discount,
                'discount_type' => $this->discount_type,
                'discount_price' => $discountprice,
                'price' => $this->price,
                'quantity' => $this->quantity,
                'variants' => json_decode($this->variants),
                'thumbnail_image' => $this->thumbnail_image,
                'images' => json_decode($this->images),
                'short_description' => json_decode($this->short_description),
                'description' => json_decode($this->description),
                'is_active' => $this->is_active == 1 ? true : false,
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ],
            'rating_counts' => $ratingCounts,
            'relatedProducts' => ProductResource::collection($relatedProducts),
            'reviews' => ProductReviewResource::collection($reviews),
            'avgRating' => number_format($avr, 1),
        ];
    }
}
