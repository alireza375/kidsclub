<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Library\SslCommerz\SslCommerzNotification;
use App\Models\BuyPackage;
use App\Models\Cart;
use App\Models\EnrollService;
use App\Models\JoinEvent;
use App\Models\Order;
use App\Models\OrderProduct;
use App\Models\Package;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\Setting;
use App\Models\User_Subscription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SslCommerzPaymentController extends Controller
{
    // Pay order via sslcommerz
    public function payBySslCommerz($order, $device_type = null, $type = null)
    {
        try {
            if (isset($order->currency) && $order->currency != 'BDT') {
                return [
                    'error' => true,
                    'message' => __('Sslcommerz payment not supported for this currency.'),
                    'data' => null,
                ];
            }

            // Make sure we have valid order data
            if (!$order) {
                return errorResponse('Invalid order data');
            }

            $payMentM = PaymentMethod::where(['type' => 'sslcommerz'])->first();

            if (!$payMentM) {
                return errorResponse(__('Sslcommerz payment configuration not found.'));
            }
            $paymentConfig = json_decode($payMentM->config, true);
            // return $paymentConfig;
            $address = $order->billing ?? $order->shipping;
            $user = Auth::guard('checkUser')->user();
            $setting = Setting::first();

            // Check the order type
            $type = $type ?? 'Order';  // Default type is 'Order'
            $amount = 0;
            $formattedAmount = number_format((float)($type == 'BuyPackage' ? ($order->total ?? 0) : $order->total ), 2, '.', '');
            $orderName = '';

            // Handle different types of orders
            if ($type === 'BuyPackage') {
                $package = Package::where('id', $order->package_id)->first();
                if (!$package) {
                    return [
                        'error' => true,
                        'message' => __('Package not found.'),
                        'data' => null,
                    ];
                }
                $packageName = json_decode($package->name)->en ?? 'Default Package Name';
                $orderName = 'BuyPackage - ' . $packageName;
            } elseif ($type === 'JoinEvent') {
                $orderName = 'JoinEvent - ' . $order->id;
            } elseif ($type === 'EnrollService') {
                $orderName = 'EnrollService - ' . $order->id;
            } else {
                $orderName = 'Order - ' . $order->id;
            }
            // Setup SSLCommerz post data
            $post_data = [
                'total_amount' => $formattedAmount,
                'currency' => 'BDT',
                'tran_id' => uniqid(),  // Unique transaction ID
                'cus_name' => $user->name ?? 'Guest',
                'cus_email' => $user->email ?? 'Guest',
                'cus_postcode' => $address->pincode ?? 'bd',
                'cus_country' => 'Bangladesh',
                'cus_phone' => $user->phone ?? '12345678',
                'ship_name' => $setting->title ?? 'Guest',
                'ship_add1' => $user->address ?? 'Dhaka',
                'ship_city' => $user->address ?? 'Dhaka',
                'ship_postcode' => $user->pincode ?? 'bd',
                'ship_country' => $user->address ?? 'No Country',
                'shipping_method' => 'Home Delivery',
                'product_name' => "O-" . $order->id,
                'product_category' => 'digital',
                'product_profile' => 'non-physical-goods',
                'value_a' => 'ref001',
                'value_b' => 'ref002',
                'value_c' => 'ref003',
                'value_d' => 'ref004',
            ];

            $apiDomain = env("IS_LOCALHOST", true)  ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
            $config = [
                'apiCredentials' => [
                    'store_id' => $paymentConfig['store_id'],
                    'store_password' => $paymentConfig['store_password'],
                ],
                'apiUrl' => [
                    'make_payment' => "/gwprocess/v4/api.php",
                    'transaction_status' => "/validator/api/merchantTransIDvalidationAPI.php",
                    'order_validate' => "/validator/api/validationserverAPI.php",
                    'refund_payment' => "/validator/api/merchantTransIDvalidationAPI.php",
                    'refund_status' => "/validator/api/merchantTransIDvalidationAPI.php",
                ],
                'apiDomain' => $apiDomain,
                'connect_from_localhost' => env("IS_LOCALHOST", false), // For Sandbox, use "true", For Live, use "false"
                'success_url' => '/api/sslcommerz-success',
                'failed_url' => '/api/sslcommerz-fail',
                'cancel_url' => '/api/sslcommerz-fail',
                'ipn_url' => '/api/sslcommerz-ipn',
            ];

            $sslc = new SslCommerzNotification($config);
            $payment_options = $sslc->makePayment($post_data, 'checkout', 'json');

            // Check if payment options is a JsonResponse object
            if ($payment_options instanceof \Illuminate\Http\JsonResponse) {
                $payment = $payment_options->getData(true);
            } else {
                $payment = json_decode($payment_options, true);
            }
            // Remove items from the cart
            // Cart::where('user_id', $order->user_id)->delete();
            // Check if the payment request was successful
            if (isset($payment['status']) && $payment['status'] == 'success') {
                if ($type == 'BuyPackage') {
                    BuyPackage::where('id', $order->id)->update([
                        'active' => 'false',
                        'payment_id' => $post_data['tran_id'],
                        'method' => 'sslcommerz',
                    ]);
                } elseif ($type == 'EnrollService') {
                    EnrollService::where('id', $order->id)->update([
                        'payment_id' => $post_data['tran_id'],
                        'method' => 'sslcommerz',
                    ]);
                } elseif ($type == 'JoinEvent') {
                    JoinEvent::where('id', $order->id)->update([
                        'payment_id' => $post_data['tran_id'],
                        'method' => 'sslcommerz',
                    ]);
                } else {
                    OrderProduct::where('id', $order->id)->update([
                        'payment_id' => $post_data['tran_id'],
                        'method' => 'sslcommerz',
                    ]);
                }

                return [
                    'error' => false,
                    'message' => 'success',
                    'data' => $payment['data'],
                ];
            } else {
                return [
                    'error' => true,
                    'message' => 'Something went wrong',
                ];
            }
        } catch (\Throwable $th) {
            return [
                'error' => true,
                'message' => $th->getMessage(),
                'data' => null
            ];
        }
    }



    // sslcommerz success
    public function success(Request $request)
    {
        try {
            $tran_id = $request->input('tran_id');
            $amount = $request->input('amount');
            $currency = $request->input('currency');
            $payMentM = PaymentMethod::where(['type' => 'sslcommerz'])->first();

            if (!$payMentM) {
                return errorResponse(__('Sslcommerz payment configuration not found.'));
            }
            $paymentConfig = json_decode($payMentM->config, true);
            $apiDomain = env("IS_LOCALHOST", true)  ? "https://sandbox.sslcommerz.com" : "https://securepay.sslcommerz.com";
            $config = [
                'apiCredentials' => [
                    'store_id' => $paymentConfig['store_id'],
                    'store_password' => $paymentConfig['store_password'],
                ],
                'apiUrl' => [
                    'make_payment' => "/gwprocess/v4/api.php",
                    'transaction_status' => "/validator/api/merchantTransIDvalidationAPI.php",
                    'order_validate' => "/validator/api/validationserverAPI.php",
                    'refund_payment' => "/validator/api/merchantTransIDvalidationAPI.php",
                    'refund_status' => "/validator/api/merchantTransIDvalidationAPI.php",
                ],
                'apiDomain' => $apiDomain,
                'connect_from_localhost' => env("IS_LOCALHOST", false), // For Sandbox, use "true", For Live, use "false"
                'success_url' => '/api/sslcommerz-success',
                'failed_url' => '/api/sslcommerz-fail',
                'cancel_url' => '/api/sslcommerz-fail',
                'ipn_url' => '/api/sslcommerz-ipn',
            ];
            $sslc = new SslCommerzNotification($config);

            // Determine the type of transaction
            $order = OrderProduct::where('payment_id', $tran_id)->first();
            if (!$order) {
                $order = BuyPackage::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = JoinEvent::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = EnrollService::where('payment_id', $tran_id)->first();
            }

            if (empty($order)) {
                return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => 'Invalid transaction.']);
            }

            if (!$order->is_paid) {
                $validation = $sslc->orderValidate($request->all(), $tran_id, $amount, $currency);
                if ($validation) {
                    $order->update([
                        'status' => PAYMENT_SUCCESS,
                        'is_paid' => true,
                    ]);

                    if (get_class($order) === BuyPackage::class) {
                        $order->update([
                            'active' => 'false',
                        ]);
                    }

                    return redirect()->away(env('APP_URL') . '/payment/success');
                }
            }

            return redirect()->away(env('APP_URL') . '/payment/success');
        } catch (\Throwable $th) {
            return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => $th->getMessage()]);
        }
    }

    // sslcommerz fail
    public function fail(Request $request)
    {
        try {
            $tran_id = $request->input('tran_id');

            $order = OrderProduct::where('payment_id', $tran_id)->first();
            if (!$order) {
                $order = BuyPackage::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = JoinEvent::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = EnrollService::where('payment_id', $tran_id)->first();
            }

            if (empty($order)) {
                return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => 'Invalid transaction.']);
            }

            if (!$order->is_paid) {
                $order->update([
                    'status' => PAYMENT_FAILED,
                    'is_paid' => false,
                ]);
                return redirect()->away(env('APP_URL') . '/payment/failed')->with('message', 'Transaction Failed.');
            }

            return redirect()->away(env('APP_URL') . '/payment/failed')->with('message', 'Transaction already successful.');
        } catch (\Throwable $th) {
            return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => $th->getMessage()]);
        }
    }

    // sslcommerz cancel
    public function cancel(Request $request)
    {
        try {
            $tran_id = $request->input('tran_id');

            $order = OrderProduct::where('payment_id', $tran_id)->first();
            if (!$order) {
                $order = BuyPackage::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = JoinEvent::where('payment_id', $tran_id)->first();
            }
            if (!$order) {
                $order = EnrollService::where('payment_id', $tran_id)->first();
            }

            if (empty($order)) {
                return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => 'Invalid transaction.']);
            }

            if (!$order->is_paid) {
                $order->update([
                    'status' => PAYMENT_FAILED,
                    'is_paid' => false,
                ]);
                return redirect()->away(env('APP_URL') . '/order/' . $order->id)->with('message', 'Transaction Cancelled.');
            }

            return redirect()->away(env('APP_URL') . '/order/' . $order->id)->with('message', 'Transaction already successful.');
        } catch (\Throwable $th) {
            return redirect()->away(env('APP_URL') . '/payment/failed')->withErrors(['message' => $th->getMessage()]);
        }
    }
}
