<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\CouponResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\UsedCoupon;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CouponService
{
    public function makeData($request)
    {
        $data = [];

        if ($request->has('name')) {
            $data['name'] = $request->get('name');
        }
        if ($request->has('code')) {
            $data['code'] = $request->get('code');
        }
        if ($request->has('discount')) {
            $data['discount'] = $request->get('discount');
        }
        if ($request->has('type')) {
            $data['type'] = $request->get('type');
        }
        if ($request->has('usage_limit_per_user')) {
            $data['usage_limit_per_user'] = $request->get('usage_limit_per_user');
        }
        if ($request->has('minimum_order_amount')) {
            $data['minimum_order_amount'] = $request->get('minimum_order_amount');
        }
        if ($request->has('expire_at')) {
            $data['expire_at'] = $request->get('expire_at');
        }
        if ($request->has('status')) {
            $data['status'] = $request->get('status') ? 1 : 0;
        }

        return $data;
    }


    // All Coupon List for admin
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Coupon::query();
        $data->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%'.$request->search.'%')
                    ->orWhere('code', 'like', '%'.$request->search.'%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Successfully gets Coupon'), new BasePaginationResource(CouponResource::collection($data)));
    }



    //public coupon list
    public function couponList($request)
    {
        // Use `select` to fetch only required columns for efficiency
        $coupons = Coupon::select('id', 'name', 'discount', 'status', 'code', 'type', 'usage_limit_per_user', 'minimum_order_amount', 'expire_at') // Adjust columns as needed
                        ->where('status', 1)
                        ->get();

        // Check if data is empty to handle no-results scenario
        if ($coupons->isEmpty()) {
            return errorResponse(__('No active coupons found'), []);
        }

        // Return success response with transformed data
        return successResponse(__('Successfully retrieved coupons'), CouponResource::collection($coupons));
    }



    // Single Coupon
    public function show($request)
    {
        $coupon = Coupon::find($request->id);
        if (! $coupon) {
            return errorResponse(__('Coupon not found.'));
        }
        return successResponse(__('Successfully gets Coupon'), CouponResource::make($coupon));
    }



    // Store Coupon
    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            $coupon = Coupon::where('code', $data['code'])->first();
            if ($coupon) {
                return errorResponse(__('This coupon already exists.Please add new'));
            }

            //expire_at can not backward
            if( Carbon::parse($data['expire_at'])->lessThan(Carbon::now()) ) {
                return errorResponse(__('expire_at can not back dated'));
            }

            $coupon = Coupon::create($data);

            return successResponse(__('Coupon created successfully.'), $coupon);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



    // Update Coupon
    public function update($request)
    {
        // Find the coupon by ID
        $coupon = Coupon::find($request->id);
        if (! $coupon) {
            return errorResponse(__('Coupon not found.'));
        }
        // Check if the code already exists, excluding the current coupon
        $existingCoupon = Coupon::where('code', $request->get('code'))
            ->where('id', '!=', $request->id) // Exclude the current coupon
            ->first();
        if ($existingCoupon) {
            return errorResponse(__('This coupon code already exists. Please use a different code.'));
        }
        // Prepare the data for update
        $data = $this->makeData($request);
        try {
            // Update the coupon with new data
            $coupon->update($data);
            return successResponse(__('Coupon updated successfully.'));
        } catch (\Exception $e) {
            // Return error response if something goes wrong
            return errorResponse($e->getMessage());
        }
    }



    // coupon Change Status
    public function changeStatus($request)
    {
        $coupon = Coupon::find($request->id);
        if (! $coupon) {
            return errorResponse(__('Coupon not found.'));
        }
        $coupon->update(['status' => $request->status == 'true' ? 1 : 0]);
        return successResponse(__('Coupon status updated successfully.'));
    }



    // Delete Coupon
    public function delete($request)
    {
        try {
            $coupon = Coupon::find($request->id);
            if (! $coupon) {
                return errorResponse(__('Coupon not found.'));
            }
            $coupon->delete();

            return successResponse(__('Coupon deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    //apply coupon
    public function applyCoupon($request)
    {
        try {
            // Check if the coupon exists
            $couponCode = Coupon::where('code', $request->code)->first();
            if (! $couponCode) {
                return errorResponse(__('Coupon not found.'));
            }

            // Check if the coupon is active
            if ($couponCode->status === 0) {
                return errorResponse(__('This coupon is not acive now.'));
            }

            // Check if the coupon has expired
            $todayDate = Carbon::now();
            $expireDate = Carbon::parse($couponCode->expire_at);
            if ($todayDate->greaterThan($expireDate)) {
                return errorResponse(__('This coupon has expired.'));
            }

            // Check user usage limit
            $user = Auth::guard('checkUser')->user();
            $cusUsed = UsedCoupon::where('user_id', $user)->count();
            if ($cusUsed >= $couponCode->usage_limit_per_user) {
                return errorResponse(__('You have reached the usage limit for this coupon.'));
            }

            // get user cart data
            $cartItems = Cart::where('user_id', $user->id)->get();
            if ($cartItems->isEmpty()) {
                return errorResponse(__('Cart not found.'));
            }
            $sub_total = 0;
            foreach ($cartItems as $cartItem) {
                $product = Product::find($cartItem->product_id);
                $sub_total += $product->discount_price == 0.00 ? $product->price * $cartItem->quantity : $product->discount_price * $cartItem->quantity;
            }
            // Check minimum order amount
            if ($couponCode->minimum_order_amount > $sub_total) {
                return errorResponse(__('You have to order more than the minimum order amount.'));
            }

            // Calculate discount based on coupon type
            $current_subtotal = 0;
            $discount  = 0;
            $coupon_value = '';
            if ($couponCode->type === 'percentage') {
                $discount  = ($sub_total * $couponCode->discount) / 100;
                $current_subtotal = $sub_total - $discount ;
                $coupon_value = number_format($couponCode->discount, 2).'%';
            } elseif ($couponCode->type === 'flat') {
                $discount  = $couponCode->discount;
                $current_subtotal = $sub_total - $discount ;
                $coupon_value = number_format($couponCode->discount, 2);
            }
            return successResponse(__('Coupon applied successfully'), [
                'current_subtotal' => round($current_subtotal, 2),
                'discount' => round($discount , 2),
                'coupon_value' => $coupon_value
            ]);
            

        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
