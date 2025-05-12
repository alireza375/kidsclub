<?php

namespace App\Http\Resources\Admin;

use App\Http\Resources\Common\ProductReviewResource;
use App\Models\Currency;
use App\Models\ProductCategory;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        if ($this->discount_type == "percentage") {
            $discountprice = $this->price - ($this->price * ($this->discount / 100));
        } else {
            $discountprice = $this->price - $this->discount;
        }

        $rating = ProductReview::where('product_id', $this->id)->avg('rating');
        $currencySymbol = Currency::where('default', 1)->first();


        $reviews = ProductReview::where('product_id', $this->id)->get();
        $category = ProductCategory::find($this->product_category_id);
        return [
            'id' => $this->id,
            'name' => json_decode($this->name),
            'price' => (float)$this->price,
            'quantity' => $this->quantity,
            'variants' => json_decode($this->variants),
            'thumbnail_image' => $this->thumbnail_image,
            'discount' => $this->discount,
            'discount_type' => $this->discount_type,
            'discount_price' => $discountprice,
            'currencySymbol' => $currencySymbol->symbol,
            'images' => json_decode($this->images),
            'short_description' => json_decode($this->short_description),
            'description' => json_decode($this->description),
            'category' => [
                'id' => $category->id,
                'name' => json_decode($category->name),
                'image' => $category->image,
                'description' => json_decode($category->description)
            ],
            'is_active' => $this->is_active == 1 ? true : false,
            'publish' => $this->publish == 1 ? true : false,
            'reviews' => $reviews->map(function ($review) {
                return [
                    'id' => $review->id,
                    'user' => [
                        'id' => $review->user_id,
                        'name' => $review->user->name,
                        'image' => $review->user->image
                    ],
                    'product_id' => $review->product_id,
                    'rating' => $review->rating,
                    'comment' => $review->comment,

                    'created_at' => $review->created_at,
                    'updated_at' => $review->updated_at,
                ];
            }),
            'avgRating' =>  number_format($rating, 2),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
