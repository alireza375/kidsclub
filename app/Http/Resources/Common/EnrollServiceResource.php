<?php

namespace App\Http\Resources\Common;

use App\Models\Currency;
use App\Models\EnrollService;
use App\Models\Product;
use App\Models\ProductCategory;
use App\Models\Service;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnrollServiceResource extends JsonResource
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

        // Decode items and prepare product details
        $items = json_decode($this->items, true);

        // Fetch all currencies only once
        $allCurrencies = Currency::all()->keyBy('code');

        //service details
        $service = Service::where('id', $this->service_id)->first();

        //$currencySymbol
        $currencySymbol = Currency::where('name', $this->currency)->pluck('symbol')->first();

        return [
            'id' => $this->id,
            'name' => json_decode($service->name),
            'image' => $service->image,
            'user' => [
                '_id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
            ],
            'Total' => (float)$this->total,
            'status' => $this->status,
            'is_paid' => $this->is_paid == 1,
            'currency' => $this->currency,
            'currencySymbol' => $currencySymbol,
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
    private function getProductDetails(array $items): array
    {
        return collect($items)->map(function ($item) {
            // Find the product
            $product = Product::find($item['productId']);

            // Return null if the product is not found
            if (!$product) {
                return null;
            }

            // Find the category
            $category = ProductCategory::find($product->category);

            // Decode product name and category name once
            $productName = $product->name ? json_decode($product->name, true) : null;
            $categoryName = $category && $category->name ? json_decode($category->name, true) : null;

            // Handle variant
            $variant = null;
            if (!empty($item['variantId']) && !empty($product->variants)) {
                $variants = json_decode($product->variants, true);
                if (is_array($variants)) {
                    $variant = collect($variants)->firstWhere('_id', $item['variantId']);
                }
            }

            // Calculate the total price if price exists in the item
            $total = isset($item['price']) ? $item['price'] : null;

            return [
                '_id' => $item['productId'],
                'name' => $productName,
                'quantity' => $item['quantity'],
                'category' => $categoryName,
                'thumbnail_image' => $product->thumbnail_image,
                'variant' => $variant,
                'total' => $total,
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
