<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\WishListRequest;
use App\Http\Resources\Admin\ProductResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Product;
use App\Models\WishList;
use Illuminate\Http\Request;

class WishListController extends Controller
{
    //Wishlist List for user
    public function index(Request $request)
    {
        // Extract sorting and pagination parameters from the request
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Fetch the user's wishlist with sorting and pagination
        $wishlists = WishList::where('user_id', auth('checkUser')->user()->id)
            ->orderBy($sort_by, $dir)
            ->paginate($per_page);

        // Extract product IDs from the wishlist items
        $productIds = $wishlists->pluck('product_id')->toArray();

        // Fetch products and their associated categories
        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        // Map wishlist items with product details using ProductResource
        $wishlistData = $wishlists->getCollection()->map(function ($wishlist) use ($products) {
            // Check if the product exists in the fetched products
            if (isset($products[$wishlist->product_id]) && is_object($products[$wishlist->product_id])) {
                $product = $products[$wishlist->product_id];

                // Decode the variants from JSON into an associative array
                $allVariants = json_decode($product->variants, true);

                // Find the selected variant that matches the variant_id from the wishlist
                $selectedVariant = collect($allVariants)->first(function ($variant) use ($wishlist) {
                    return isset($variant['id']) && $variant['id'] === $wishlist->variant_id;
                });

                // Use ProductResource for product details
                $productResource = new ProductResource($product);
                $productData = $productResource->toArray(request());

                return array_merge($productData, [
                    'variant' => $selectedVariant ? [
                        'id' => $selectedVariant['id'],
                        'name' => $selectedVariant['name'],
                        'in_stock' => $selectedVariant['in_stock'],
                    ] : null, // Include the selected variant if found
                    'wishlist_created_at' => $wishlist->created_at,
                    'wishlist_updated_at' => $wishlist->updated_at,
                ]);
            }

            // Handle case when the product is not found or not an object
            return [
                'id' => $wishlist->product_id,
                'product' => null,
                'wishlist_created_at' => $wishlist->created_at,
                'wishlist_updated_at' => $wishlist->updated_at,
            ];
        })->filter(); // Filter out null values (if a product wasn't found)

        // Create a new LengthAwarePaginator instance for the paginated wishlist data
        $collection = new \Illuminate\Pagination\LengthAwarePaginator(
            $wishlistData,
            $wishlists->total(),
            $wishlists->perPage(),
            $wishlists->currentPage(),
            ['path' => $wishlists->url($wishlists->currentPage())]
        );

        // Return the success response with paginated wishlist data
        return successResponse(__('WishList fetched successfully.'), new BasePaginationResource($collection));
    }


    // Add WishList
    public function store(WishListRequest $request)
    {
        $productId = $request->get('productId', null);
        $product = Product::find($productId);
        if (!$product) {
            return errorResponse(__('Product not found'));
        }

        // check wishlist
        if (WishList::where('user_id', auth('checkUser')->user()->id)->where('product_id', $productId)->exists()) {
           // remove wishlist
            WishList::where('user_id', auth('checkUser')->user()->id)->where('product_id', $productId)->delete();
            return successResponse(__('WishList removed successfully.'));
        }
        WishList::create([
            'user_id' => auth('checkUser')->user()->id,
            'product_id' => $productId,
            'variant_id' => $request->get('variantId', null),
        ]);
        return successResponse(__('WishList added successfully.'));
    }
}
