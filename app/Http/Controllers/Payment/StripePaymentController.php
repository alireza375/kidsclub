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
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\UsedCoupon;
use App\Models\User;
use ErrorException;
use Illuminate\Http\Request;
use Stripe\Stripe;

use function Laravel\Prompts\error;

class StripePaymentController extends Controller
{
    //Pay order via stripe
    public function payByStripe($order, $device_type = null, $type = null)
    {
        try {
            $jsonStr = file_get_contents('php://input');
            $jsonObj = json_decode($jsonStr);

            // Fetch the Stripe configuration from the database
            $payMentM = PaymentMethod::where(['type' => 'stripe'])->first();
            if (!$payMentM) {
                return errorResponse(__('Stripe payment configuration not found.'));
            }

            $config = json_decode($payMentM->config, true);
            if (!isset($config['clientSecret'])) {
                return errorResponse(__('Client secret not found in Stripe payment configuration'));
            }

            $sKey = $config['clientSecret'];
            $stripe = new \Stripe\StripeClient($sKey);


            // Payment type (Order, BuyPackage, or Join Event) and calculate the amount
            $amount = 0;
            $orderName = '';
            $type = $type ?? 'Order';

            if ($type === 'BuyPackage') {
                $amount = ($order->total * 100) - $order->discount;
                $package = Package::where('id', $order->package_id)->first();
                if (!$package) {
                    return [
                        'error' => true,
                        'message' => __('Package not found.'),
                        'data' => null,
                    ];
                }
                $orderName = 'BuyPackage - ' . json_decode($package->name)->en;
            } elseif ($type === 'JoinEvent') {
                $amount = $order->total * 100;  // Assuming order->total is the price for joining the event
                $orderName = 'JoinEvent - ' . $order->id;
            }
            elseif ($type === 'EnrollService') {
                $amount = $order->total * 100;
                $orderName = 'EnrollService - ' . $order->id;
            } else {
                $amount = $order->total * 100;
                $orderName = 'Order - ' . $order->id;
            }

            // Create the checkout session
            $checkout_session = $stripe->checkout->sessions->create([
                'line_items' => [[
                    'price_data' => [
                        'product_data' => [
                            'name' => $orderName,
                            'metadata' => [
                                'pro_id' => 1,
                            ],
                        ],
                        'unit_amount' => $amount,
                        'currency' => $order->currency,
                    ],
                    'quantity' => 1,
                ]],
                'mode' => 'payment',
                'success_url' => env('APP_URL') . '/api/stripe-verify?id=' . $order->id . '&type=' . $type,
                'cancel_url' => env('APP_URL') . '/paymentFailed',
            ]);

            // Update the payment details in the database
            if ($type === 'BuyPackage') {
                BuyPackage::where('id', $order->id)->update([
                    'payment_id' => $checkout_session->id,
                    'method' => 'stripe',
                ]);
            } elseif ($type === 'JoinEvent') {
                JoinEvent::where('id', $order->id)->update([
                    'payment_id' => $checkout_session->id,
                    'method' => 'stripe',
                ]);
            }elseif ($type === 'EnrollService') {
                EnrollService::where('id', $order->id)->update([
                    'payment_id' => $checkout_session->id,
                    'method' => 'stripe',
                ]);
            }
             else {
                OrderProduct::where('id', $order->id)->update([
                    'payment_id' => $checkout_session->id,
                    'method' => 'stripe',
                ]);
            }

            // Remove items from the cart
            Cart::where('user_id', $order->user_id)->delete();

            return [
                'error' => false,
                'message' => 'Success',
                'data' => $checkout_session->url,
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage(),
                'data' => null,
            ];
        }
    }



    // Verify stripe payment
    public function verify(Request $request)
    {
        if (empty($request->id) || empty($request->type)) {
            return redirect()->away(env('APP_URL') . '/paymentFailed');
        }

        // Fetch payment record based on type
        if ($request->type === 'BuyPackage') {
            $payment = BuyPackage::where('id', $request->id)->first();
        } elseif ($request->type === 'JoinEvent') {
            $payment = JoinEvent::where('id', $request->id)->first();
        }elseif ($request->type === 'EnrollService') {
            $payment = EnrollService::where('id', $request->id)->first();
        } else {
            $payment = OrderProduct::where('id', $request->id)->first();
        }

        if (empty($payment)) {
            if ($request->has('device_type') && $request->device_type === 'app') {
                return errorResponse(__('Invalid Transaction ID'));
            } else {
                return redirect()->away(env('APP_URL') . '/paymentFailed');
            }
        }

        // Retrieve Stripe configuration
        $payMentM = PaymentMethod::where(['type' => 'stripe'])->first();
        if (!$payMentM) {
            return errorResponse(__('Stripe payment method not configured.'));
        }

        $config = json_decode($payMentM->config, true);
        if (empty($config['clientSecret'])) {
            return errorResponse(__('Stripe client secret is missing.'));
        }

        $sKey = $config['clientSecret'];
        $stripe = new \Stripe\StripeClient($sKey);

        // Retrieve payment session details
        try {
            $stripe_payment = $stripe->checkout->sessions->retrieve(
                $payment->payment_id,
                []
            );
        } catch (\Exception $e) {
            return errorResponse(__('Unable to verify payment: ') . $e->getMessage());
        }

        // Check if the payment was successful
        if ($stripe_payment->status === 'complete' && $stripe_payment->payment_status === 'paid') {
            // Update payment status for the respective type
            if ($request->type === 'BuyPackage') {
                $payment->update([
                    'status' => 'paid',
                    'is_paid' => true,
                ]);

                // Delete previous packages for the user
                BuyPackage::where('user_id', $payment->user_id)
                    ->where('id', '!=', $payment->id)
                    ->delete();
            } elseif ($request->type === 'JoinEvent') {
                $payment->update([
                    'status' => 'paid',
                    'is_paid' => true,
                ]);
            }elseif ($request->type === 'EnrollService') {
                $payment->update([
                    'status' => 'paid',
                    'is_paid' => true,
                ]);
            } else {
                $payment->update([
                    'status' => PAYMENT_SUCCESS,
                    'is_paid' => true,
                ]);
            }

            // Handle coupons if applicable
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

            if ($request->has('device_type') && $request->device_type === 'app') {
                return successResponse(__('Payment Success'));
            } else {
                return redirect()->away(env('APP_URL').'/payment/success');
            }
        } else {
            // Update failed payment status
            $payment->update([
                'status' => PAYMENT_FAILED,
            ]);

            if ($request->has('device_type') && $request->device_type === 'app') {
                return errorResponse(__('Payment Failed'));
            } else {
                return redirect()->away(env('APP_URL') . '/paymentFailed');
            }
        }
    }




}
