<?php

use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\PakageController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ServiceFaqController;
use App\Http\Controllers\Admin\ServiceNoticeController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Common\ChildrenController;
use App\Http\Controllers\Common\AuthController;
use App\Http\Controllers\Common\BlogCommentController;
use App\Http\Controllers\Common\BuyPackageController;
use App\Http\Controllers\Common\CartController;
use App\Http\Controllers\Common\EnrollServiceController;
use App\Http\Controllers\Common\FileUploadController;
use App\Http\Controllers\Common\JoinEventController;
use App\Http\Controllers\Common\OrderController;
use App\Http\Controllers\Common\ProductReviewController;
use App\Http\Controllers\Common\ProfileController;
use App\Http\Controllers\Common\ReviewController;
use App\Http\Controllers\Common\VarificationController;
use App\Http\Controllers\Common\WishListController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\Payment\MolliePaymentController;
use App\Http\Controllers\Payment\PayPalController;
use App\Http\Controllers\Payment\RazorpayPaymentController;
use App\Http\Controllers\Payment\SslCommerzPaymentController;
use App\Http\Controllers\Payment\StripePaymentController;
use App\Models\Newsletter;
use Illuminate\Support\Facades\Route;

Route::post('login', [AuthController::class, 'login']);
Route::post('registration', [AuthController::class, 'registration']);
Route::post('reset-password', [AuthController::class, 'resetPassword']);
Route::post('send-otp', [VarificationController::class, 'sendOtp']);
Route::post('verify-otp', [VarificationController::class, 'verifyOtp']);
Route::get('/favicon', [AuthController::class, 'getFavicon']);


Route::group(['middleware' => 'checkUser'], function () {
    //profile
    Route::get('user', [ProfileController::class, 'getProfile']);
    Route::post('user/find', [ProfileController::class, 'findProfile']);
    Route::post('user', [ProfileController::class, 'updateProfile']);

    //change password
    Route::put('update-password', [AuthController::class, 'updatePassword']);

    //user dashboard
    Route::get('dashboard/user', [DashboardController::class, 'userDashboard']);
});


// File Upload
Route::post('upload-single', [FileUploadController::class, 'uploadSingle']);
Route::post('upload-multiple', [FileUploadController::class, 'uploadMultiple']);
Route::post('delete-file', [FileUploadController::class, 'removeFile']);

// Setting
Route::get('settings/public', [SettingController::class, 'getPublicSettings']);
Route::get('language/translations', [LanguageController::class, 'show']);
Route::get('language/languages', [LanguageController::class, 'index']);


// AuthorizationLanguage
Route::group(['middleware' => 'checkUser'], function () {
    Route::get('profile', [ProfileController::class, 'getProfile']);

    // Blog Comment
    Route::post('comment', [BlogCommentController::class, 'store']);
    Route::delete('comment', [BlogCommentController::class, 'delete']);

    // Wish list
    Route::post('wishlist/add', [WishListController::class, 'store']);
    Route::get('wishlist/list', [WishListController::class, 'index']);

    // Cart
    Route::get('product/cart/list', [CartController::class, 'show']);
    Route::post('product/cart', [CartController::class, 'store']);
    Route::delete('product/cart', [CartController::class, 'delete']);

    //join event
    Route::post('join/event', [JoinEventController::class, 'joinEvent']);

    //enroll service
    Route::post('enroll/service', [EnrollServiceController::class, 'enroll']);

    //buy package
    Route::post('buy/package', [BuyPackageController::class, 'buyPackage']);
    Route::get('user/package/list', [BuyPackageController::class, 'userPackage']);

    // Payment List
    Route::get('payment/method/user/list', [PaymentMethodController::class, 'userIndex']);

    //service per user list
    Route::get('service/peruser/list', [ServiceController::class, 'perUserList']);

    //children handle section
    Route::get('children/list', [ChildrenController::class, 'index']);
    Route::get('children', [ChildrenController::class, 'show']);
    Route::post('children', [ChildrenController::class, 'storeChildren']);
    Route::put('children', [ChildrenController::class, 'updateChildren']);
    Route::delete('children', [ChildrenController::class, 'delete']);

    // join service
    Route::post('service/join-by-user', [ServiceController::class, 'joinByUser']);

    // Product Review
    Route::post('product/review', [ProductReviewController::class, 'storeReview']);

    // Notification
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::post('notifications/read', [NotificationController::class, 'read']);
    Route::delete('notifications/delete', [NotificationController::class, 'delete']);


    // Order
    Route::get('order/product/list', [OrderController::class, 'userOrderList']);

    //service notice list
    Route::get('enroll/service/notice/list', [ServiceNoticeController::class, 'noticeList']);
    Route::get('service/notice', [ServiceNoticeController::class, 'show']);

  // apply coupon
  Route::post('coupon/apply', [CouponController::class, 'applyCoupon']);


});

//  Product Review List
Route::get('product/review/user/list', [ProductReviewController::class, 'userIndex']);

// Service Review List
Route::get('service/review/user/list', [ReviewController::class, 'userIndex']);

// Testimonial List
Route::get('testimonial/list', [TestimonialController::class, 'userIndex']);

// Gallery for public
Route::get('gallery/public/list', [GalleryController::class, 'publicIndex']);

// Faq
Route::get('faq/list', [FaqController::class, 'index']);
Route::get('faq', [FaqController::class, 'show']);

//Page
Route::get('page/list', [PageController::class, 'index']);
Route::get('page', [PageController::class, 'getPage']);


// Contact
Route::post('contact', [ContactController::class, 'store']);

// Newsletter
Route::post('newsletter', [NewsletterController::class, 'subscribe']);

// Coupon
Route::get('coupon/user/list', [CouponController::class, 'couponList']);

//Currency
Route::get('currency/list', [CurrencyController::class, 'index']);


// Product category list
Route::get('product/category/list', [ProductCategoryController::class, 'index']);



// Product
Route::get('product/public/list', [ProductController::class, 'publicIndex']);
Route::get('product/details', [ProductController::class, 'getproduct']);

//blog category list
Route::get('blog/category/list', [BlogCategoryController::class, 'index']);

// Blog List for popular
Route::get('blog/popular/list', [BlogController::class, 'popularList']);
Route::get('blog/details', [BlogController::class, 'show']);
Route::get('blog/comment', [BlogCommentController::class, 'index']);


// Route for both admin and coach
Route::group(['middleware' => 'AdminOrCoach'], function () {
    //blog add by admin or trainer
    Route::post('blog', [BlogController::class, 'store']);
    Route::get('blog', [BlogController::class, 'show']);
    Route::put('blog/update', [BlogController::class, 'update']);
    Route::delete('blog', [BlogController::class, 'delete']);
    Route::get('blog/list', [BlogController::class, 'index']);


    //service notice
    Route::get('service/notice/list', [ServiceNoticeController::class, 'index']);
    Route::get('service/notice', [ServiceNoticeController::class, 'show']);
    Route::post('service/notice', [ServiceNoticeController::class, 'store']);
    Route::put('service/notice', [ServiceNoticeController::class, 'update']);
    Route::delete('service/notice', [ServiceNoticeController::class, 'delete']);
});


// Blog List for all
Route::get('blog/user/list', [BlogController::class, 'blogIndex']);

//public event
Route::get('event/list', [EventController::class, 'publicEventList']);
Route::get('event/details', [EventController::class, 'show']);


// Public Coach List
Route::get('public/trainer/list', [AuthController::class, 'publicIndex']);

//service
Route::get('service/list', [ServiceController::class, 'userIndex']);
Route::get('service/details', [ServiceController::class, 'show']);

// Language
Route::get('language/list', [LanguageController::class, 'index']);

//Product order
Route::post('order/product', [OrderController::class, 'placeOrder']);
Route::get('order/product', [OrderController::class, 'show']);


// Stripe
Route::get("stripe-verify", [StripePaymentController::class, 'verify']);

//paypal
Route::get("paypal/payment/success", [PayPalController::class, 'success']);
Route::get("paypal/payment/cancel", [PayPalController::class, 'cancel']);

//mollie
Route::get("mollie-verify", [MolliePaymentController::class, 'verify']);

//razorpay
Route::get("razorpay-verify", [RazorpayPaymentController::class, 'verify']);

//SSLCommerz
Route::post("sslcommerz-success", [SslCommerzPaymentController::class, 'success']);
Route::post("sslcommerz-fail", [SslCommerzPaymentController::class, 'fail']);

//join event
Route::get('join/event', [JoinEventController::class, 'show']);
Route::get('join/event/list', [JoinEventController::class, 'userOrderList']);

//service review
Route::post('service/review', [ReviewController::class, 'storeReview']);

// payment method
Route::get('payment/method/public-list', [PaymentMethodController::class, 'publicIndex']);

//service faq
Route::get('service/faq/list', [ServiceFaqController::class, 'index']);

//service notice
Route::get('service/notice/list', [ServiceNoticeController::class, 'index']);

//pakage
Route::get('package/list', [PackageController::class, 'index']);
Route::get('package/details', [PackageController::class, 'show']);

//purchased list
Route::get('buy/package/list', [BuyPackageController::class, 'userList']);

//advertisement
Route::get('advertisement', [AdvertisementController::class, 'show']);
Route::get('advertisement/active', [AdvertisementController::class, 'activeAd']);

//instructor details
Route::get('service/instructor/details', [ServiceController::class, 'instructorDetails']);


