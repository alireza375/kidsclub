<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Js;

class CartController extends Controller
{
    // Make data
    public function makeData($request)
    {
        $user = Auth::guard('checkUser')->user()->id;
        $data = [
            'user_id' => $user,
            'product_id' => $request->get('product_id'),
            'quantity' => $request->get('quantity') ?? 1,
            'variants' => Json_encode($request->get('variants')),
        ];

        return $data;
    }

    // Store Cart
    public function store(Request $request)
    {
        $data = $this->makeData($request);

        $userId = $data['user_id'];
        $productId = $data['product_id'];
        $cartItem = Cart::where('user_id', $userId)
        ->where('product_id', $productId)
        ->first();
        // return $cartItem->variants;

        try {
            if ($cartItem) {
            
                    $cartItem->quantity = $data['quantity'];

                    // return $cartItem;
    
                    if ($cartItem->quantity <= 0) {
                        $cartItem->delete();
                        return successResponse(__('Cart item removed successfully.'));
                    } else {
                        $cartItem->save();
                        return successResponse(__('Quantity updated successfully.'));
                    }
               
            } else{
                // Create new cart item if quantity is positive
            Cart::create($data);
            return successResponse(__('Cart item added successfully.'));
            }
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Show Cart
    public function show()
    {
        $userId = Auth::guard('checkUser')->user()->id;

        $cartItems = Cart::where('user_id', $userId)->get();
        // return $cartItems;
        if ($cartItems->isEmpty()) {
            return errorResponse(__('Cart not found'));
        }
        // return $cartItems;
        $products = [];
        $total = 0;
        foreach ($cartItems as $cartItem) {
            $product = Product::find($cartItem->product_id);
            // $variants = Cart::find($cartItem->id)->variants;
             $products[] =[
                    'id' => $product->id,
                    'name' => json_decode($product->name),
                    'price' => $product->discount_price == 0.00 ? $product->price : $product->discount_price,
                    'total' => $product->discount_price == 0.00 ? $product->price : $product->discount_price * $cartItem->quantity,
                    'quantity' => $cartItem->quantity,
                    'variants' => json_decode($cartItem->variants),
                    'thumbnail_image' => $product->thumbnail_image,
                    'images' => $product->images
             ];
             $total += $product->discount_price == 0.00 ? $product->price : $product->discount_price * $cartItem->quantity;
        };

        return successResponse(__('Successfully gets cart'), [
            "id" => Auth::guard('checkUser')->user()->id,
            "user_id" => Auth::guard('checkUser')->user()->id,
            "total" => $total,
            "products" => $products
        ]);
    }

    // Delete product with variants from cart
    public function delete(Request $request)
    {
        try {
            $userId = Auth::guard('checkUser')->user()->id;
            $cartItem = Cart::where('user_id', $userId)->where('product_id', $request->product_id)->first();

            if (!$cartItem) {
                return errorResponse(__('Cart item not found.'));
            }
            $cartItem->delete();
            return successResponse(__('Cart item deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



}
