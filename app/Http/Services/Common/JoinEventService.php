<?php

namespace App\Http\Services\Common;

use App\Http\Controllers\Payment\MolliePaymentController;
use App\Http\Controllers\Payment\PayPalController;
use App\Http\Controllers\Payment\RazorpayPaymentController;
use App\Http\Controllers\Payment\SslCommerzPaymentController;
use App\Http\Controllers\Payment\StripePaymentController;
use App\Http\Requests\Common\JoinEventRequest;
use App\Http\Resources\Common\JoinEventResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use Illuminate\Support\Str;
use App\Models\Currency;
use App\Models\JoinEvent;
use App\Models\PaymentMethod;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class JoinEventService
{
    //user order list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $userId = Auth::guard('checkUser')->user()->id;
        // Start a new query builder instance
        $data = $data = JoinEvent::with('event')  // Load related event details
            ->where('user_id', $userId);

        // Filter by specific status if provided
        $data->when($request->filled('status'), function ($q) use ($request) {
            $q->where('status', $request->status);
        });

        // Add search filter if 'search' parameter is provided and not empty
        $data->when($request->filled('search'), function ($q) use ($request) {
            $q->where(function ($q) use ($request) {
                $q->where('status', 'like', '%' . $request->search . '%');
            });
        });

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Event fetched successfully.'), new BasePaginationResource(JoinEventResource::collection($data)));
    }

    //admin order list
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $query = JoinEvent::query();

        // Apply search filter for ID if provided
        if (! empty($request->search)) {
            $query->where('id', 'like', '%' . $request->search . '%');
        }
        if (! empty($request->status)) {
            $query->where('status', $request->status);
        }
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Order fetched successfully.'), new BasePaginationResource(JoinEventResource::collection($data)));
    }

    // Show
    public function show($request)
    {
        $data = JoinEvent::find($request->_id);
        if (! $data) {
            return errorResponse(__('Order not found.'));
        }
        return successResponse(__('Order fetched successfully.'), new JoinEventResource($data));
    }

    //order create
    public function joinEvent(JoinEventRequest $request)
    {
        // Check if user is active
        $user = Auth::guard('checkUser')->user();
        if ($user->status != ACTIVE) {
            return errorResponse(__('Your account is not active. Please contact the administrator.'));
        }

        // Check and validate currency
        if ($request->currency && $request->currency != '') {
            $currency = Currency::where('code', $request->currency)->first();
            if (!$currency) {
                return errorResponse(__('Invalid currency provided.'));
            }
        } else {
            return errorResponse(__('Currency not found.'));
        }

        // Ensure total is positive
        $event = Event::find($request->event_id);
        if (!$event) {
            return errorResponse(__('Event not found.'));
        }

        // Ensure payment method is valid
        if ($event->type !== 'free') {
            if ($request->method && $request->method != '') {
                $paymentMethod = PaymentMethod::where('type', $request->method)->first();
                if (!$paymentMethod) {
                    return errorResponse(__('Invalid payment method provided.'));
                }
            } else {
                return errorResponse(__('Invalid payment method provided.'));
            }
        }


        //check if event has discount
        if ($event->discount > 0) {
            if ($event->discount_type == 'percentage') {
                $discount = ($event->discount / 100) * $event->price;
            } else {
                $discount = $event->discount;
            }
            // Calculate total
            $total = $event->price - $discount;
            $total = $total * $currency->rate;

        } else {
            $total = $event->price;
            $total = $total * $currency->rate;
        }

        // Ensure total is positive
        if ($total < 0) {
            return errorResponse(__('Total cannot be negative.'));
        }
        // Generate Ticket
        $randomString = Str::random(4);
        $ticketId = strtoupper('TICKET-' . time() . '-' . $randomString);
        // Prepare order data
        $orderData = [
            'user_id' => Auth::guard('checkUser')->id(),
            'event_id' => $request->event_id,
            'ticket' => $ticketId,
            'currency' => $request->currency,
            'total' => $total,
            'status' => $request->status ?? 'pending',
            'method' => $request->method,
            'is_paid' => ($request->status === 'paid') ? 1 : 0,
            'payment_id' => null,
        ];
        if ($event->type == 'free') {
            $orderData['status'] = 'paid';
            $orderData['is_paid'] = 1;
            $orderData['method'] = 'free';
            JoinEvent::create($orderData);
            return successResponse(__('Event joined successfully.'));
        }

        // Begin transaction and create the order
        DB::beginTransaction();
        try {
            $order = JoinEvent::create($orderData);
            // Process payment
            $paymentUrl = null;
            if ($request->method == 'stripe') {
                $paymentUrl = app(StripePaymentController::class)->payByStripe($order, $request->device_type ?? 'web', 'JoinEvent');
            } elseif ($request->method == 'paypal') {
                $paymentUrl = app(PayPalController::class)->payByPaypal($order, $request->device_type ?? 'web', 'JoinEvent');
            } elseif ($request->method == 'sslcommerz') {
                $paymentUrl = app(SslCommerzPaymentController::class)->payBySslCommerz($order, $request->device_type ?? 'web', 'JoinEvent');
            } elseif ($request->method == 'mollie') {
                $paymentUrl = app(MolliePaymentController::class)->payByMollie($order, $request->device_type ?? 'web', 'JoinEvent');
            } elseif ($request->method == 'razorpay') {
                $paymentUrl = app(RazorpayPaymentController::class)->payByRazorpay($order, $request->device_type ?? 'web', 'JoinEvent');
            }
                // Check if payment failed
            if ($paymentUrl['error'] == true) {
                DB::rollBack();
                return errorResponse($paymentUrl['message']);
            } else {
                DB::commit();

                // Send notification to admin
                $user = User::find($order->user_id);
                $admin = User::where(['role' => ADMIN])->first();
                sendNotification($admin->id, 'New Order Placed from ' . $user->name . '', 'Order', $user->image);

                return response()->json([
                    'success' => true,
                    'msg' => 'Order created successfully. Please complete the payment.',
                    'data' => $paymentUrl['data'],
                ]);
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return errorResponse($e->getMessage());
        }
    }


    // Update order status
    public function statusUpdate($request)
    {
        // Find the order by orderId
        $order = JoinEvent::find($request->orderId);
        if (!$order) {
            return errorResponse(__('Order not found.'));
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
                $product = Event::find($value->productId);
                if (!$product) {
                    return errorResponse(__('Product not found.'));
                }

                // Check if enough stock is available for each item in the order
                if ($product->quantity < $value->quantity) {
                    return errorResponse(__('Product out of stock.'));
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
}
