<?php

namespace App\Http\Resources\Common;

use App\Models\Currency;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Fetch the user once to avoid multiple queries
        $user = User::find($this->user_id);

        $currencySymbol = Currency::where('code', $this->currency)->first();

        // If user not found, return default or error response
        if (!$user) {
            return [
                'error' => 'User not found',
                'id' => $this->id,
                'order_id' => $this->order_id,
                'items' => json_decode($this->items, true),
                'shipping_address' => json_decode($this->shipping_address, true),
                'subTotal' => (float)$this->total,
                'status' => $this->status,
                'is_paid' => $this->is_paid == 1,
                'currency' => $this->currency,
                'currencySymbol' => $currencySymbol->symbol,
                'discount' => $this->discount ?? 0,
                'location' => $this->location,
                'city' => $this->city,
                'zip_code' => $this->zip_code,
                'payment' => [
                    'method' => $this->method,
                    'status' => $this->is_paid == 1,
                    'amount' => $this->total,
                    'transaction_id' => $this->payment_id,
                ],
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
            ];
        }

        // Decode items and prepare product details
        $items = json_decode($this->items, true);
        $productDetails = $this->getProductDetails($items, $user->id);

        // Fetch all currencies only once
        $allCurrencies = Currency::all()->keyBy('code');

        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'items' => $productDetails,
            'shipping_address' => json_decode($this->shipping_address, true),
            'subTotal' => (float)$this->total,
            'status' => $this->status,
            'is_paid' => $this->is_paid == 1,
            'currency' => $this->currency,
            'currencySymbol' => $currencySymbol->symbol,
            'discount' => $this->discount ?? 0,
            'location' => $this->location,
            'city' => $this->city,
            'zip_code' => $this->zip_code,
            'payment' => [
                'method' => $this->method,
                'status' => $this->is_paid == 1,
                'amount' => $this->total,
                'transaction_id' => $this->payment_id,
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    /**
     * Get detailed product information.
     *
     * @param array $items
     * @return array
     */
    private function getProductDetails($items, $userId)
    {
        return collect($items)->map(function ($item, $index) use ($userId) {
            $product = Product::find($item['productId']);

            if (!$product) {
                return null;
            }

            $category = ProductCategory::find($product->category);

            $reviews = $product->reviews()->where('user_id', $userId)->first();

            $productName = $product->name ? json_decode($product->name, true) : null;
            $categoryName = $category && $category->name ? json_decode($category->name, true) : null;

            $variant = isset($item['variants']) ? json_decode($item['variants'], true) : null;

            // Calculate the total price if price exists in the item
            $total = isset($item['discount_price']) ? $item['discount_price'] : null;

            return [
                'id' => $item['productId'],
                'name' => $productName,
                'quantity' => $item['quantity'],
                'category' => $categoryName,
                'thumbnail_image' => $product->thumbnail_image,
                'variant' => $variant,
                'total' => $total,
                'reviews' => $reviews,
            ];
        })
        // Filter out any null products (in case a product is not found)
        ->filter()
        ->toArray();
    }

    /**
     * Get the currency symbol by code.
     *
     * @param \Illuminate\Support\Collection $currencies
     * @param string $code
     * @return string|null
     */
    private function getCurrencySymbol($currencies, $code): ?string
    {
        return $currencies[$code]->symbol ?? null;
    }
}
