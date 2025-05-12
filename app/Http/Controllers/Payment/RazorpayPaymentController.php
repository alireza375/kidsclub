<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\BuyPackage;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\EnrollService;
use App\Models\JoinEvent;
use App\Models\OrderProduct;
use App\Models\Package;
use App\Models\Pakage;
use App\Models\PaymentMethod;
use App\Models\UsedCoupon;
use App\Models\User_Subscription; // Add this model
use ErrorException;
use Illuminate\Http\Request;
use Razorpay\Api\Api;

class RazorpayPaymentController extends Controller
{
    // Generate Razorpay payment link
    public function
     payByRazorpay($order, $device_type = null, $type = null)
    {
        try {
            // Fetch Razorpay configuration from the database
            $paymentMethod = PaymentMethod::where('type', 'Razorpay')->first();

            if (! $paymentMethod) {
               return [
                'error' => true,
                'message' => 'Razorpay payment method configuration not found.',
                'data' => null,
               ];
            }

            // Access the `config` field as an array directly
            $config = json_decode($paymentMethod->config, true);
            if (empty($config['keyId']) || empty($config['keySecret']) || empty($config['mode'])) {
               return [
                'error' => true,
                'message' => 'Razorpay payment method configuration incomplete.',
                'data' => null,
               ];
            }
            $clientId = $config['keyId'];
            $clientSecret = $config['keySecret'];
            $mode = $config['mode'];

            // Initialize Razorpay API with credentials from the database
            $api = new Api($clientId, $clientSecret);


            // Determine the amount based on order type
            $amount = 0;
            $orderName = '';
            if ($type == 'EnrollService') {
                $amount = $order->total * 100;
                $orderName = 'EnrollService ';
            }
            elseif($type == 'BuyPackage'){
                $amount = $order->total * 100;
                $orderName = 'BuyPackage - '.$order->id;
            }
            elseif($type == 'JoinEvent'){
                $amount = $order->total * 100;
                $orderName = 'JoinEvent - '.$order->id;
            }
            else {
                $amount = ($order->total * 100) - $order->discount;
                $orderName = 'Order - '.$order->id;
            }

            // Define the payment link data
            $paymentLinkData = [
                'type' => 'link',
                'amount' => $amount,
                'currency' => $order->currency,
                'description' => 'Payment for #'.$orderName,

                'callback_url' => env('APP_URL').'/api/razorpay-verify?id='.$order->id.'&type='.$type,
                'callback_method' => 'get',
            ];


            // Create the payment link via Razorpay API
            $paymentLink = $api->invoice->create($paymentLinkData);
            $paymentData = $paymentLink->toArray();

            // Save the payment data to the order or subscription
            if ($type === 'BuyPackage') {
                BuyPackage::where('id', $order->id)->update([
                    'payment_id' => $paymentData['id'],
                    'method' => 'Razorpay',
                ]);
            }
            elseif ($type === 'JoinEvent') {
                JoinEvent::where('id', $order->id)->update([
                    'payment_id' => $paymentData['id'],
                    'method' => 'Razorpay',
                ]);
            }
            elseif ($type === 'EnrollService') {
                EnrollService::where('id', $order->id)->update([
                    'payment_id' => $paymentData['id'],
                    'method' => 'Razorpay',
                ]);
            }
            else {
                OrderProduct::where('id', $order->id)->update([
                    'payment_id' => $paymentData['id'],
                    'method' => 'Razorpay',
                ]);
            }

            // Remove item from cart
            Cart::where('user_id', $order->user_id)->delete();

            return [
                'error' => false,
                'message' => 'Payment link created successfully',
                'data' => $paymentData['short_url'],
            ];

        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => 'Payment session creation failed: '.$e->getMessage(),
                'data' => null,
            ];
        }
    }

    // Verify Razorpay payment
    public function verify(Request $request)
    {
        if (empty($request->id) && empty($request->type)) {
            return redirect()->away(env('APP_URL').'/payment/failed');
        }

        // Retrieve the payment record based on type
        if ($request->type === 'EnrollService') {
            $payment = EnrollService::where(['id' => $request->id])->first();
        } elseif ($request->type === 'BuyPackage') {
            $payment = BuyPackage::where(['id' => $request->id])->first();
        } elseif ($request->type === 'JoinEvent') {
            $payment = JoinEvent::where(['id' => $request->id])->first();
        } else {
            $payment = OrderProduct::where(['id' => $request->id])->first();
        }
        if (empty($payment)) {
            if ($request->has('device_type') && $request->device_type == 'app') {
                return errorResponse(__('Invalid Transaction ID'));
            } else {
                return redirect()->away(env('APP_URL').'/payment/failed');
            }
        }

        // Fetch Razorpay configuration from the database
        $paymentMethod = PaymentMethod::where('type', 'Razorpay')->first();
        if (! $paymentMethod) {
            throw new ErrorException('Payment method configuration not found.');
        }

        // Decode the config column (assumed to be JSON stored in the `config` column)
        $config = json_decode($paymentMethod->config, true);
        $clientId = $config['keyId'];
        $clientSecret = $config['keySecret'];
        $mode = $config['mode'];

        // Initialize Razorpay API with credentials from the database
        $api = new Api($clientId, $clientSecret);

        try {
            // Fetch payment details from Razorpay
            $paymentDetails = $api->invoice->fetch($request->razorpay_invoice_id);
            if ($paymentDetails->status === 'paid') {
                // Update payment record as paid
                if ($request->type === 'BuyPackage') {
                    $payment->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                } elseif ($request->type === 'JoinEvent') {
                    $payment->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                } elseif ($request->type === 'EnrollService') {
                    $payment->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                } else {
                    $payment->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                }

                // Update used coupons if applicable
                if ($payment->discount_coupon) {
                    $coupon = Coupon::where('code', $payment->discount_coupon)->first();
                    if ($coupon) {
                        UsedCoupon::create([
                            'code' => $coupon->code,
                            'user_id' => $payment->user_id,
                            'value' => $coupon->discount,
                            'discount_type' => $coupon->type,
                        ]);
                    }
                }

                if ($request->has('device_type') && $request->device_type == 'app') {
                    return successResponse(__('Payment Success'));
                } else {
                    return redirect()->away(env('APP_URL').'/payment/success');
                }
            } else {
                $payment->update([
                    'status' => PAYMENT_FAILED,
                    'is_paid' => false,
                ]);

                if ($request->has('device_type') && $request->device_type == 'app') {
                    return errorResponse(__('Payment Failed'));
                } else {
                    return redirect()->away(env('APP_URL').'/payment/failed');
                }
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => 'Failed to fetch payment details: '.$e->getMessage(),
                'data' => null,
            ];
        }

        return redirect()->away(env('APP_URL').'/payment/failed');
    }
}
