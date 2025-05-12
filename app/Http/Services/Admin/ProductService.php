<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ProductResource;
use App\Http\Resources\Admin\SingleProductResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Cart;
use App\Models\Product;
use App\Models\WishList;
use Illuminate\Support\Str;

class ProductService
{
    public function makeData($request)
    {
        $variants = $request->get('variants');

        // if (is_array($variants)) {
        //     foreach ($variants as &$variant) {
        //         $variant['id'] = Str::uuid()->toString();
        //     }
        // }
        if(isset($request->discount_type)){
            if($request->discount_type == 'percentage'){
                $request->merge(['discount_price' => $request->price * $request->discount / 100]);
            }else{
                $request->merge(['discount_price' => $request->discount]);
            }
        }else{
            $request->merge(['discount_price' => $request->price]);
        }
        $data = [
            'name' => json_encode($request->get('name')),
            'short_description' => json_encode($request->get('short_description')),
            'description' => json_encode($request->get('description')),
            'price' => $request->get('price'),
            'quantity' => $request->get('quantity'),
            'variants' => json_encode($variants),
            'thumbnail_image' => $request->thumbnail_image,
            'product_category_id' => $request->get('category'),
            'images' => json_encode($request->images),
            'is_active' => $request->is_active == 'true' ? 1 : 0,
            'discount' => $request->get('discount') ?? 0.00,
            'discount_type' => $request->get('discount_type') ?? null,
            'discount_price' => $request->discount_price ?? 0.00
        ];
        return $data;
    }

    // Product List  for admin
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        $query = Product::query();
        $query->when($request->search, function ($q) use ($request, $lang) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $q->where(function ($q) use ($searchTerm, $lang) {
                // Search the 'name', 'title', and 'description' fields in the given language
                $q->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`name`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                );
            });
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Product fetched successfully.'), new BasePaginationResource(ProductResource::collection($data)));

    }


    // Product Store
    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            $product = Product::create($data);
            return successResponse(__('Product created successfully.'), $product);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Product Update
    public function update($request)
    {
        $product = Product::find($request->id);
        if (! $product) {
            return errorResponse(__('Product not found'));
        }
        // Ensure $prevImages is always an array
        $prevImages = $request->has('prev_images') ? (array) $request->get('prev_images') : [];
        foreach ($prevImages as $imageUrl) {
            $deleted = fileRemoveAWS($imageUrl);
            if (! $deleted) {
                return errorResponse(__('Failed to delete one or more images'));
            }
        }

        $data = [
            'name' => isset($request->name) ? json_encode($request->get('name')) : $product->name,
            'short_description' => isset($request->short_description) ? json_encode($request->get('short_description')) : $product->short_description,
            'description' => isset($request->description) ? json_encode($request->get('description')) : $product->description,
            'price' => isset($request->price) ? $request->price : $product->price,
            'quantity' => isset($request->quantity) ? $request->quantity : $product->quantity,
            'variants' => isset($request->variants) ? json_encode($request->get('variants')) : $product->variants,
            'thumbnail_image' => isset($request->thumbnail_image) ? $request->thumbnail_image : $product->thumbnail_image,
            'product_category_id' => isset($request->category) ? $request->category : $product->product_category_id,
            'images' => isset($request->images) ? json_encode($request->get('images')) : $product->images,
            'is_active' => isset($request->is_active) ? $request->is_active : $product->is_active,
            'discount' => isset($request->discount) ? $request->discount : $product->discount,
            'discount_type' => isset($request->discount_type) ? $request->discount_type : $product->discount_type,
            'discount_price' => isset($request->discount_price) ? $request->discount_price : $product->discount_price


        ];
        if ($data['discount_type'] == 'percentage') {
            $data['discount_price'] = $data['price'] * (1 - $data['discount'] / 100);
        } else {
            $data['discount_price'] = $data['price'] - $data['discount'];
        }
        try {
            $product->update($data);
            return successResponse(__('Product updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Product details show for Admin
    public function show($request)
    {
        $product = Product::find($request->id);
        if (! $product) {
            return errorResponse(__('Product not found'));
        } try {
            return successResponse(__('Product fetched successfully.'), new ProductResource($product));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Product Details show for User
    public function getproduct($request)
    {
        $product = Product::find($request->id);
        if (! $product) {
            return errorResponse(__('Product not found'));
        }
        return successResponse(__('Product fetched successfully.'), new SingleProductResource($product));
    }


    // Product Delete
    public function delete($request)
    {
        $product = Product::find($request->id);
        if (!$product) {
            return errorResponse(__('Product not found'));
        }
        try {
            $wish = WishList::where('product_id', $product->id);
            if ($wish->exists()) {
                $wish->delete();
            }

            $cart = Cart::where('product_id', $product->id);
            if ($cart->exists()) {
                $cart->delete();
            }

            removeFile($product->thumbnail_image);
            $images = json_decode($product->images);
            foreach ($images as $image) {
                removeFile($image);
            }
            $product->delete();
            return successResponse(__('Product deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Product Publish
    public function publish($request)
    {
        $product = Product::find($request->productId);

        if (! $product) {
            return errorResponse(__('Product not found.'));
        }
        // Toggle the publish status (0 becomes 1 and 1 becomes 0)
        $product->publish = ! $product->publish;
        $product->update();

        return successResponse(__($product->publish ? 'Product published successfully.' : 'Product unpublished successfully.'));
    }



    // product details show for User
    public function publicIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? 10;
        $lang = $request->langCode ?? 'en';
        $query = Product::query();
        $query->where('publish', 1);

        // Filter by search term in product name if provided
        if (! empty($request->search)) {
            $query->where('name->'.$lang, 'like', '%'.$request->search.'%');
        }

        // Filter by category name if provided
        if (! empty($request->category)) {
            $query->whereHas('productCategory', function ($q) use ($request, $lang) {
                $q->where('name->'.$lang, 'like', '%'.$request->category.'%');
            });
        }

        // Sort and paginate the results
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Product fetched successfully.'), new BasePaginationResource(ProductResource::collection($data)));

    }




}
