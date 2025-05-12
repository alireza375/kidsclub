<?php

namespace App\Http\Services\Common;

use App\Http\Controllers\Payment\MolliePaymentController;
use App\Http\Controllers\Payment\PayPalController;
use App\Http\Controllers\Payment\RazorpayPaymentController;
use App\Http\Controllers\Payment\SslCommerzPaymentController;
use App\Http\Controllers\Payment\StripePaymentController;
use App\Http\Requests\Common\OrderRequest;
use App\Http\Resources\Common\OrderResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use Illuminate\Support\Str;
use App\Models\Coupon;
use App\Models\Currency;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Models\UsedCoupon;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderService
{
    //user order list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Start a new query builder instance
        $data = OrderProduct::query()
            ->where('user_id', Auth::guard('checkUser')->user()->id);

        // Filter by specific status if provided
        $data->when($request->filled('status'), function ($q) use ($request) {
            $q->where('status', $request->status);
        });

        // Add search filter if 'search' parameter is provided and not empty
        $data->when($request->filled('search'), function ($q) use ($request) {
            $q->where(function ($q) use ($request) {
                $q->where('status', 'like', '%'.$request->search.'%');
            });
        });

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Order fetched successfully.'), new BasePaginationResource(OrderResource::collection($data)));
    }

    //admin order list
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $query = OrderProduct::query();

        // Apply case-insensitive search
        if (!empty($request->search)) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $query->where(function ($q) use ($searchTerm) {
                $q->orWhereRaw("LOWER(`name`) LIKE ?", [$searchTerm])
                  ->orWhereRaw("LOWER(`order_id`) LIKE ?", [$searchTerm])
                  ->orWhereRaw("LOWER(`method`) LIKE ?", [$searchTerm])
                  ->orWhereRaw("LOWER(`id`) LIKE ?", [$searchTerm])
                  ->orWhereRaw("LOWER(`status`) LIKE ?", [$searchTerm]);
            });
        }

        // Apply status filter if provided
        if (!empty($request->status)) {
            $query->where('status', $request->status);
        }

        // Apply sorting and pagination
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        // Return the response
        return successResponse(
            __('Order fetched successfully.'),
            new BasePaginationResource(OrderResource::collection($data))
        );
    }



    // Show
    public function show($request)
    {
        $data = OrderProduct::find($request->id);
        if (! $data) {
            return errorResponse(__('Order not found.'));
        }
        return successResponse(__('Order fetched successfully.'), new OrderResource($data));
    }

    //order create
    public function placeOrder(OrderRequest $request)
    {
        // Check if user is active
        $user = Auth::guard('checkUser')->user();
        if ($user->status != ACTIVE) {
            return errorResponse(__('Your account is not active. Please contact the administrator.'));
        }

        // Validate and get products from the items array
        $items = $request->items; // This should be an array from the request
        if (empty($items) || ! is_array($items)) {
            return errorResponse(__('Items cannot be empty or invalid.'));
        }

        if ($request->currency && $request->currency != '') {
            // Calculate exchange rate
            $currency = Currency::where('code', $request->currency)->first();
        } else {
            return errorResponse(__('Currency not found.'));
        }

        // Initialize variables for the order calculation
        $validItems = [];
        $total = 0; // Initialize total as 0
        $discount = 0;

        // Process each item in the order
        foreach ($items as $item) {
            if (!isset($item['productId']) || !isset($item['quantity'])) {
                return errorResponse(__('Invalid item data.'));
            }
            $product = Product::find($item['productId']);
            if (!$product) {
                return errorResponse(__('Product with ID ' . $item['productId'] . ' not found.'));
            }

            if ($item['quantity'] <= 0) {
                return errorResponse(__('Order must have at least one product.'));
            }

            // Calculate price for the item and total
            $validItems[] = [
                'productId' => $item['productId'],
                'quantity' => $item['quantity'],
                'variants' => json_encode($item['variants'] ?? []) // Use variants if available, otherwise empty array
            ];


             // Fallback when no variants are provided
                $total += $product['discount_price'] * $item['quantity'] * $currency->rate;
                $validItems[count($validItems) - 1]['discount_price'] = $product['discount_price'] * $item['quantity'] * $currency->rate;


        }

        // Apply discount if coupon is provided
        if ($request->has('discount_coupon') && $request->discount_coupon != '') {
            $couponCode = Coupon::where('code', $request->discount_coupon)->first();
            if ($couponCode) {
                // Check if coupon is valid, not expired, and usage limit
                if ($couponCode->status === 0) {
                    return errorResponse(__('This coupon is not active.'));
                }
                if (Carbon::now()->greaterThan(Carbon::parse($couponCode->expire_at))) {
                    return errorResponse(__('This coupon has expired.'));
                }
                $usedCoupons = UsedCoupon::where('user_id', $user->id)->count();
                if ($usedCoupons >= $couponCode->usage_limit_per_user) {
                    return errorResponse(__('You have reached the usage limit for this coupon.'));
                }
                if ($couponCode->minimum_order_amount > $total) {
                    return errorResponse(__('Your order is below the minimum amount for this coupon.'));
                }

                // Calculate discount
                if ($couponCode->type === 'percentage') {
                    $discount = ($total * $couponCode->discount) / 100;
                } elseif ($couponCode->type === 'flat') {
                    $discount = $couponCode->discount;
                }
                $discount = $discount * $currency->rate;
                $total = $total - $discount; // Deduct discount from total
            } else {
                return errorResponse(__('Coupon not found.'));
            }
        }

        // Ensure total is positive
        $total = max($total, 0);

        // Generate Ticket
        $randomString = str::random(5);
        $orderId = strtoupper('ORDER-'.'-' . $randomString);

        // Prepare order data
        $orderData = [
            'order_id' => $orderId,
            'user_id' => Auth::guard('checkUser')->id(),
            'name' => $request->name,
            'currency' => $request->currency,
            'shipping_address' => json_encode($request->shipping_address),
            'items' => json_encode($validItems),
            'total' => $total,
            'status' => $request->status ?? 'pending',
            'method' => $request->method,
            'discount_coupon' => $request->discount_coupon ?? null,
            'is_paid' => ($request->status === 'paid') ? 1 : 0,
            'payment_id' => null,
            'discount' => $discount,
        ];
        // Begin transaction and create the order
        DB::beginTransaction();
        try {
            // Create the order
            $order = OrderProduct::create($orderData);

            // Process the payment (depending on payment method)
            $paymentUrl = null;
            if ($request->method == 'stripe') {
                $paymentUrl = app(StripePaymentController::class)->payByStripe($order, $request->device_type ?? 'web', 'order');
            } elseif ($request->method == 'paypal') {
                $paymentUrl = app(PayPalController::class)->payByPaypal($order, $request->device_type ?? 'web', 'order');
            } elseif ($request->method == 'sslcommerz') {
                $paymentUrl = app(SslCommerzPaymentController::class)->payBySslCommerz($order, $request->device_type ?? 'web', 'order');
            } elseif ($request->method == 'mollie') {
                $paymentUrl = app(MolliePaymentController::class)->payByMollie($order, $request->device_type ?? 'web', 'order');
            } elseif ($request->method == 'razorpay') {
                $paymentUrl = app(RazorpayPaymentController::class)->payByRazorpay($order, $request->device_type ?? 'web', 'order');
            }

            // Handle payment URL response
            if ($paymentUrl['error'] == true) {
                DB::rollBack();
                return errorResponse($paymentUrl['message']);
            } else {
                DB::commit();

                // Send notification to admin
                $user = User::find($order->user_id);
                $admin = User::where(['role' => ADMIN])->first();
                sendNotification($admin->id, 'New Order Placed from '.$user->name.'', 'Order', $user->image);

                // Return success response
                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully. Please complete the payment.',
                    'data' => $paymentUrl['data'],
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponse($e->getMessage());
        }
    }


    public function statusUpdate($request)
    {
        $order = OrderProduct::find($request->id);

        if ($request->status == 'completed') {
            if ($order->is_paid == 0) {
                return errorResponse(__('Please complete the payment first.'));
            }
            $items = json_decode($order->items);
            foreach ($items as $key => $value) {
                // update stock
                $product = Product::find($value->productId);
                if($product->quantity < $value->quantity){
                    return errorResponse('Product out of stock.');
                }
                $product->quantity = $product->quantity - $value->quantity;
                $product->save();
            }
            $order->update([
                'status' => $request->status,
            ]);
        } elseif ($request->status == 'cancelled') {
            if ($order->is_paid == 1) {
                return errorResponse(__('Please refund the payment first.'));
            }
            $order->update([
                'status' => $request->status,
            ]);
        } elseif ($request->status == 'pending') {
            if ($order->is_paid == 0) {
                return errorResponse(__('Please complete the payment first.'));
            }
            $order->update([
                'status' => $request->status,
            ]);
        } else {
            return errorResponse(__('Order status not found.'));
        }

        return successResponse(__('Order status updated successfully.'));
    }

    //delete order
    public function deleteOrder($request)
    {
        $order = OrderProduct::find($request->id);
        if (! $order) {
            return errorResponse(__('Order not found.'));
        }
        $order->delete();

        return successResponse(__('Order deleted successfully.'));
    }
}
