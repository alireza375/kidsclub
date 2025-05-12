<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\BuyPackage;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\EnrollService;
use App\Models\JoinEvent;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Package;
use App\Models\PaymentMethod;
use App\Models\UsedCoupon;
use App\Models\User_Subscription;
use Illuminate\Http\Request;
use Mollie\Laravel\Facades\Mollie;

class MolliePaymentController extends Controller
{
    // Pay by Mollie
    public function payByMollie($order, $device_type = null, $type = null)
    {
        try {
            // Fetch Mollie configuration
            $mollieConfig = PaymentMethod::where('type', 'mollie')->first();
            if (! $mollieConfig) {
               return [
                        'error' => true,
                        'message' => __('Mollie configuration not found.'),
                        'data' => null,
                    ];
            }
            // return $mollieConfig;
            Mollie::api()->setApiKey(json_decode($mollieConfig['config'])->key);
            // Determine the amount and description based on type
            $type = $type ?? 'Order';
            $formattedAmount = number_format(($type == 'BuyPackage' ? $order->total : $order->total - $order->discount), 2, '.', '');
            $orderName = '';
            if ($type === 'BuyPackage') {
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
                $orderName = 'JoinEvent - ' . $order->id;
            }
            elseif ($type === 'EnrollService') {
                $orderName = 'EnrollService - ' . $order->id;
            } else {
                $orderName = 'Order - ' . $order->id;
            }
            // Create the payment session with Mollie
            $payment = Mollie::api()->payments->create([
                'amount' => [
                    'currency' => $order->currency,
                    'value' => $formattedAmount,
                ],
                'description' => 'Payment for ' . $orderName,
                'redirectUrl' => env('APP_URL') . '/api/mollie-verify?id=' . $order->id . '&type=' . $type,
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);

            if ($payment->id) {
                // Update payment_id and method in the relevant table
                if ($type === 'BuyPackage') {
                    BuyPackage::where('id', $order->id)->update([
                        'payment_id' => $payment->id,
                        'method' => 'mollie',
                    ]);
                } elseif ($type === 'JoinEvent') {
                    JoinEvent::where('id', $order->id)->update([
                        'payment_id' => $payment->id,
                        'method' => 'mollie',
                    ]);
                }elseif ($type === 'EnrollService') {
                    EnrollService::where('id', $order->id)->update([
                        'payment_id' => $payment->id,
                        'method' => 'mollie',
                    ]);
                }
                 else {
                    OrderProduct::where('id', $order->id)->update([
                        'payment_id' => $payment->id,
                        'method' => 'mollie',
                    ]);
                }
                // Remove item from cart
                Cart::where('user_id', $order->user_id)->delete();
                return [
                    'error' => false,
                    'message' => 'Payment session created successfully',
                    'data' => $payment->getCheckoutUrl(),
                ];
            }
        } catch (\Mollie\Api\Exceptions\ApiException $e) {
            $errorMessage = $this->getReadableErrorMessage($e->getCode(), $e->getMessage());
            return [
                'error' => true,
                'message' => $errorMessage,
            ];
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => 'An error occurred: ' . $e->getMessage(),
            ];
        }
    }

    // Verify payment via Mollie
    public function verify(Request $request)
    {
        $mollieConfig = PaymentMethod::where('type', 'mollie')->first();
        if (! $mollieConfig) {
            return response()->json([
                'error' => true,
                'message' => 'Mollie configuration not found for this user',
            ], 400);
        }

        try {
            Mollie::api()->setApiKey(json_decode($mollieConfig->config)->key);

            // Determine if it is an Order,buyPackage,enrollService or JoinEvent
            $type = $request->type ?? 'Order';
            if ($request->type === 'BuyPackage') {
                $order = BuyPackage::where('id', $request->id)->first();
            } elseif ($request->type === 'JoinEvent') {
                $order = JoinEvent::where('id', $request->id)->first();
            }elseif ($request->type === 'EnrollService') {
                $order = EnrollService::where('id', $request->id)->first();
            } else {
                $order = OrderProduct::where('id', $request->id)->first();
            }

            if (empty($order)) {
                return response()->json(['error' => true, 'message' => 'Order/Subscription not found'], 404);
            }

            // Check if already paid
            if ($order->is_paid == 1) {
                return redirect()->away(env('APP_URL') . '/payment/success');
            }

            // Retrieve the payment details from Mollie
            $payment = Mollie::api()->payments->get($order->payment_id);

            // Check payment status and update accordingly
            if ($payment->status == 'paid') {
                // Update order or subscription to paid status
                if ($type == 'Subscription') {
                    $order->update([
                        'active' => true,
                        'is_paid' => true,
                    ]);
                    User_Subscription::where('user_id', $order->user_id)->where('id', '!=', $order->id)->delete();
                } else {
                    $order->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                }

                // If a coupon was used, log it in the UsedCoupon table
                if ($order->discount_coupon) {
                    $coupon = Coupon::where('code', $order->discount_coupon)->first();
                    if ($coupon) {
                        UsedCoupon::create([
                            'code' => $coupon->code,
                            'user_id' => $order->user_id,
                            'value' => $coupon->discount,
                            'discount_type' => $coupon->type,
                        ]);
                    }
                }

                return redirect()->away(env('APP_URL') . '/payment/success');
            } else {
                // If the payment failed
                $order->update([
                    'status' => PAYMENT_FAILED,
                    'is_paid' => false,
                ]);

                return redirect()->away(env('APP_URL') . '/payment/failed');
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    private function getReadableErrorMessage($errorCode, $originalMessage)
{
    // Map specific error codes or patterns to readable messages
    switch ($errorCode) {
        case 422:
            if (strpos($originalMessage, 'No suitable payment methods found') !== false) {
                return 'No suitable payment methods are available for this transaction. Please check your payment settings or contact support.';
            }
            if (strpos($originalMessage, 'amount') !== false) {
                return 'The payment amount is invalid. Please ensure the amount meets the minimum requirements.';
            }
            return 'The payment request could not be processed. Please verify your details and try again.';

        case 401:
            return 'Unauthorized access. Please check your Mollie API key.';

        case 403:
            return 'Access forbidden. Your account might not have sufficient permissions.';

        default:
            // Fallback for unknown errors
            return 'An error occurred during the payment process. Please try again later.';
    }
}

}


