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
use App\Models\User_Subscription;
use App\Models\PaymentMethod; // Add this model
use App\Models\UsedCoupon;
use Srmklive\PayPal\Services\PayPal as PayPalClient; // Import PayPalClient
use Illuminate\Http\Request;

class PayPalController extends Controller
{
    // Pay order via PayPal
    public function payByPaypal($order, $device_type = null, $type = null)
    {
        try {
            // Retrieve PayPal credentials from the 'payment_method' table
            $paymentMethod = PaymentMethod::where(['type' => 'paypal'])->first();
            if (!$paymentMethod) {
                return errorResponse('PayPal payment method configuration not found.');
            }

            // Decode the JSON config stored in the 'config' column
            $paypalConfig = json_decode($paymentMethod->config, true);

            // Initialize PayPal client with credentials from the database
            $provider = new PayPalClient([
                'mode'    => $paypalConfig['mode'],
                'sandbox' => [
                    'client_id'         => $paypalConfig['clientId'],
                    'client_secret'     => $paypalConfig['clientSecret'],
                    'app_id'            => 'APP-80W284485P519543T',
                ],
                'live' => [
                    'client_id'         => $paypalConfig['clientId'],
                    'client_secret'     => $paypalConfig['clientSecret'],
                    'app_id'            => $paypalConfig['appId'] ?? '',
                ],

                'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'),
                'currency'       => env('PAYPAL_CURRENCY', 'USD'),
                'notify_url'     => env('PAYPAL_NOTIFY_URL', ''),
                'locale'         => env('PAYPAL_LOCALE', 'en_US'),
                'validate_ssl'   => env('PAYPAL_VALIDATE_SSL', true),
            ]);
            // Fetch the access token
            $paypalToken = $provider->getAccessToken();
            $provider->setCurrency($order->currency);

            // Set up the amount and order name based on type
            $amount = 0;
            $orderName = '';
            $type = $type ?? 'Order';

            if ($type == 'BuyPackage') {
                $amount = $order->total;
                $amount = $order->total;
                $orderName = 'BuyPackage - ' . $order->id;
            }
            elseif($type == 'EnrollService'){
                $amount = $order->total;
                $orderName = 'EnrollService - ' . $order->id;
            }
            elseif($type == 'JoinEvent'){
                $amount = $order->total;
                $orderName = 'JoinEvent - ' . $order->id;
            }
            else{
                $amount = $order->total - $order->discount;
                $orderName = 'Order - ' . $order->id;
            }
            // Create the PayPal order
            $response = $provider->createOrder([
                "intent" => "CAPTURE",
                "application_context" => [
                    "return_url" => env('APP_URL') . '/api/paypal/payment/success?id=' . $order->id . '&type=' . $type,
                    "cancel_url" => env('APP_URL') . '/api/paypal/payment/cancel?id=' . $order->id,
                ],
                "purchase_units" => [
                    [
                        "amount" => [
                            "currency_code" => $order->currency,
                            "value" => $amount,
                        ]
                    ]
                ]
            ]);
            // Handle the response
            if (isset($response['id']) && $response['id'] != null) {
                foreach ($response['links'] as $links) {
                    if ($links['rel'] == 'approve') {
                        // Update the order or subscription
                        if ($type == 'BuyPackage') {
                            BuyPackage::where('id', $order->id)->update([
                                'payment_id' => $response['id'],
                                'method' => 'paypal',
                            ]);
                        }
                        elseif ($type == 'EnrollService') {
                            EnrollService::where('id', $order->id)->update([
                                'payment_id' => $response['id'],
                                'method' => 'paypal',
                            ]);
                        }
                        elseif ($type == 'JoinEvent') {
                            JoinEvent::where('id', $order->id)->update([
                                'payment_id' => $response['id'],
                                'method' => 'paypal',
                            ]);
                        }

                        OrderProduct::where('id', $order->id)->update([
                            'payment_id' => $response['id'],
                            'method' => 'paypal',
                        ]);

                        // Remove item from cart
                        Cart::where('user_id', $order->user_id)->delete();

                        return [
                            'error' => false,
                            'data' => $links['href']
                        ];
                    }
                }
            } else {
                return [
                    'error' => true,
                    'message' => 'Error creating PayPal order',
                ];
            }
        } catch (\Exception $e) {
            return [
                'error' => true,
                'message' => $e->getMessage() . ' - ' . $e->getLine(),
            ];
        }
    }


    // Pay order cancel via PayPal
    public function cancel(Request $request)
    {
        $payment = OrderProduct::find($request->id);
        if (!empty($payment)) {
            $payment->update([
                'status' => 'PAYMENT_FAILED' // Ensure PAYMENT_FAILED is a constant or a status value
            ]);
        }
        return redirect()->away(env('APP_URL'). '/payment/cancel');
    }

    // Pay order success via PayPal
        public function success(Request $request)
        {
            // Fetch PayPal credentials from the database
            $paymentMethod = PaymentMethod::where('type', 'paypal')->first();

            if (!$paymentMethod) {
                return errorResponse('PayPal credentials not found.');
            }

            $paypalConfig = json_decode($paymentMethod->config);


            $provider = new PayPalClient([
                'mode'    => $paypalConfig->mode,
                'sandbox' => [
                    'client_id'         => $paypalConfig->clientId,
                    'client_secret'     => $paypalConfig->clientSecret,
                    'app_id'            => 'APP-80W284485P519543T',
                ],
                'live' => [
                    'client_id'         => $paypalConfig->clientId,
                    'client_secret'     => $paypalConfig->clientSecret,
                    'app_id'            => $paypalConfig->appId ?? '',
                ],

                'payment_action' => env('PAYPAL_PAYMENT_ACTION', 'Sale'), // Can only be 'Sale', 'Authorization' or 'Order'
                'currency'       => env('PAYPAL_CURRENCY', 'USD'),
                'notify_url'     => env('PAYPAL_NOTIFY_URL', ''), // Change this accordingly for your application.
                'locale'         => env('PAYPAL_LOCALE', 'en_US'), // force gateway language  i.e. it_IT, es_ES, en_US ... (for express checkout only)
                'validate_ssl'   => env('PAYPAL_VALIDATE_SSL', true), // Validate SSL when creating api client.
            ]);

            $provider->getAccessToken();

            $response = $provider->capturePaymentOrder($request['token']);

            // Check order or subscription
            if ($request->type == 'BuyPackage') {
                $payment = BuyPackage::where(['payment_id' => $request['token']])->first();
            }
            elseif ($request->type == 'EnrollService') {
                $payment = EnrollService::where(['payment_id' => $request['token']])->first();
            }
            elseif ($request->type == 'JoinEvent') {
                $payment = JoinEvent::where(['payment_id' => $request['token']])->first();
            }
            else {
                $payment = OrderProduct::where(['payment_id' => $request['token']])->first();
            }

            if ($payment->is_paid == true) {
                return redirect()->away(env('APP_URL'). '/payment/success');
            }

            if (isset($response['status']) && $response['status'] == 'COMPLETED') {
                if ($request->type == 'Subscription') {
                    $payment->update([
                        'active' => true,
                        'is_paid' => 1,
                    ]);

                    // Delete previous subscription
                    BuyPackage::where('user_id', $payment->user_id)->where('id', '!=', $payment->id)->delete();
                    echo __("payment completed");
                    return redirect()->away(env('APP_URL'). '/payment/success');
                } else {
                    $payment->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);
                }

                // Check if a coupon was used and update the `usedcoupons` table
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

                echo __("payment completed");
                return redirect()->away(env('APP_URL'). '/payment/success');
            } else {
                echo __($response['message'] ?? 'Something went wrong.');
                return redirect()->away(env('APP_URL'). '/payment/failed');
            }
        }
}
