<?php

namespace App\Http\Services\Common;

use App\Http\Controllers\Payment\MolliePaymentController;
use App\Http\Controllers\Payment\PayPalController;
use App\Http\Controllers\Payment\RazorpayPaymentController;
use App\Http\Controllers\Payment\SslCommerzPaymentController;
use App\Http\Controllers\Payment\StripePaymentController;
use App\Http\Resources\Common\BuyPackageAdminResource;
use App\Http\Resources\Common\BuyPackageResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\BuyPackage;
use App\Models\Currency;
use App\Models\Package;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuyPackageService
{
    //user order list
    public function userPackage($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Start a new query builder instance
        $data = BuyPackage::query()
            ->where('user_id', Auth::guard('checkUser')->user()->id)
            ->where('is_paid', 1);

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Order fetched successfully.'), new BasePaginationResource(BuyPackageResource::collection($data)));
    }


    //buy package list
    public function buyPackageIndex($request){
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = BuyPackage::query();
        $data->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('', 'like', '%'.$request->search.'%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Order fetched successfully.'), new BasePaginationResource(BuyPackageAdminResource::collection($data)));
    }

    //admin order list
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $query = BuyPackage::query();

        // Apply search filter for ID if provided
        if (! empty($request->search)) {
            $query->where('id', 'like', '%'.$request->search.'%');
        }
        if (! empty($request->status)) {
            $query->where('status', $request->status);
        }
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Order fetched successfully.'), new BasePaginationResource(BuyPackageResource::collection($data)));
    }

    // Show
    public function show($request)
    {
        $data = BuyPackage::find($request->_id);
        if (! $data) {
            return errorResponse(__('Order not found.'));
        }

        return successResponse(__('Order fetched successfully.'), new BuyPackageResource($data));
    }

    //order create
    public function buyPackage($request)
    {
        // Check if user is active
        $user = Auth::guard('checkUser')->user();
        if ($user->status != ACTIVE) {
            return errorResponse(__('Your account is not active. Please contact the administrator.'));
        }

        // Check and validate currency
        if ($request->currency && $request->currency != '') {
            $currency = Currency::where('code', $request->currency)->first();
            if (! $currency) {
                return errorResponse(__('Invalid currency provided.'));
            }
        } else {
            return errorResponse(__('Currency not found.'));
        }

        // Check if package exists
        $package = Package::find($request->package_id);
        if (! $package) {
            return errorResponse(__('package not found.'));
        }


        // Prepare order data
        $orderData = [
            'user_id' => Auth::guard('checkUser')->id(),
            'package_id' => $request->package_id,
            'currency' => $request->currency,
            'total' => $package->price,
            'status' => $request->status ?? 'pending',
            'method' => $request->method,
            'is_paid' => ($request->status === 'paid') ? 1 : 0,
            'payment_id' => null,
        ];

        // Begin transaction and create the order
        DB::beginTransaction();
        try {
            $order = BuyPackage::create($orderData);

            // Process payment
            $paymentUrl = null;
            if ($request->method == 'stripe') {
                $paymentUrl = app(StripePaymentController::class)->payByStripe($order, $request->device_type ?? 'web', 'BuyPackage');
            } elseif ($request->method == 'paypal') {
                $paymentUrl = app(PayPalController::class)->payByPaypal($order, $request->device_type ?? 'web', 'BuyPackage');
            } elseif ($request->method == 'sslcommerz') {
                $paymentUrl = app(SslCommerzPaymentController::class)->payBySslCommerz($order, $request->device_type ?? 'web', 'BuyPackage');
            } elseif ($request->method == 'mollie') {
                $paymentUrl = app(MolliePaymentController::class)->payByMollie($order, $request->device_type ?? 'web', 'BuyPackage');
            } elseif ($request->method == 'razorpay') {
                $paymentUrl = app(RazorpayPaymentController::class)->payByRazorpay($order, $request->device_type ?? 'web', 'BuyPackage');
            }


            // Handle errors in payment URL
            if ($paymentUrl['error'] == true) {
                DB::rollBack();

                return errorResponse($paymentUrl['message']);
            }

            DB::commit();
            $user = User::find($order->user_id);
            $admin = User::where(['role' => ADMIN])->first();
            sendNotification($admin->id, 'New Order Placed from '.$user->name.'', 'Order', $user->image);

            return response()->json([
                'success' => true,
                'msg' => 'Package purchase successfully. Please complete the payment.',
                'data' => $paymentUrl['data'],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return errorResponse($e->getMessage());
        }

    }

    // Update order status
    public function statusUpdate($request)
    {
        // Find the order by orderId
        $order = BuyPackage::find($request->orderId);
        if (! $order) {
            return errorResponse(__('Package not found.'));
        }

        // Check the payment status based on the order's 'is_paid' field
        if ($request->status == 'completed') {
            // Ensure payment is completed before proceeding with completion
            if ($order->is_paid == 0) {
                return errorResponse(__('Please complete the payment first.'));
            }

            // Handle stock update for the items in the order
            $items = json_decode($order->items);
            foreach ($items as $key => $value) {
                // Check if the product exists and has sufficient stock
                $product = Package::find($value->productId);
                if (! $product) {
                    return errorResponse(__('Package not found.'));
                }

                // Check if enough stock is available for each item in the order
                if ($product->quantity < $value->quantity) {
                    return errorResponse(__('Package out of stock.'));
                }

                // Update product stock after the order is completed
                $product->quantity = $product->quantity - $value->quantity;
                $product->save();
            }

            // Update the order status to 'completed'
            $order->update([
                'status' => $request->status,
            ]);
        } elseif ($request->status == 'cancelled') {
            // Handle cancellation if the order is paid
            if ($order->is_paid == 1) {
                return errorResponse(__('Please refund the payment first.'));
            }

            // Check if the order has already been completed
            if ($order->status == 'completed') {
                return errorResponse(__('Your order is completed, it cannot be cancelled.'));
            }

            // Update the order status to 'cancelled'
            $order->update([
                'status' => $request->status,
            ]);
        } elseif ($request->status == 'accepted') {
            // Ensure payment is completed before accepting the order
            if ($order->is_paid == 0) {
                return errorResponse(__('Please complete the payment first.'));
            }

            // Check if the order is already completed
            if ($order->status == 'completed') {
                return errorResponse(__('Your order has already been completed.'));
            }

            // Update the order status to 'accepted'
            $order->update([
                'status' => $request->status,
            ]);
        } elseif ($request->status == 'pending') {
            // Prevent status change to 'pending'
            return errorResponse(__('You cannot change the status to pending.'));
        }

        return successResponse(__('Order status updated successfully.'));
    }

    //enroll package delete
    public function delete($request)
    {
        $order = BuyPackage::find($request->id);
        if (! $order) {
            return errorResponse(__('Package not found.'));
        }
        $order->delete();

        return successResponse(__('Package deleted successfully.'));
    }
}
