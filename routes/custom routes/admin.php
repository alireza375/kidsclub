<?php

use App\Http\Controllers\Admin\AdvertisementController;
use App\Http\Controllers\Admin\BlogCategoryController;
use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\LanguageController;
use App\Http\Controllers\Admin\ContactController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\MailCredentialController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Common\AuthController;
use App\Http\Controllers\Admin\FaqController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\NewsletterController;
use App\Http\Controllers\Admin\PackageController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ProductCategoryController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\ServiceFaqController;
use App\Http\Controllers\Admin\ServiceNoticeController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\TestimonialController;
use App\Http\Controllers\Common\BlogCommentController;
use App\Http\Controllers\Common\BuyPackageController;
use App\Http\Controllers\Common\ChildrenController;
use App\Http\Controllers\Common\OrderController;
use App\Http\Controllers\Common\ProductReviewController;
use App\Http\Controllers\Common\ReviewController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Admin routing section with middleware protection
Route::group(['middleware' => 'admin'], function () {

    Route::get('dashboard/admin', [DashboardController::class, 'getDashboard']);


    // Page Management Routes
    Route::post('page', [PageController::class, 'addOrUpdatePage']);
    Route::delete('page{slug?}', [PageController::class, 'delete']);

    // Coach Management Routes
    Route::post('add/coach', [AuthController::class, 'createCoach']);
    Route::get('admin/coach', [AuthController::class, 'CoachList']);
    Route::delete('admin/user', [AuthController::class, 'delete']);
    Route::delete('admin/coach', [AuthController::class, 'delete']);


    // Testimonial Management Routes
    Route::post('testimonial', [TestimonialController::class, 'store']);
    Route::delete('testimonial', [TestimonialController::class, 'delete']);
    Route::post('testimonial/status', [TestimonialController::class, 'changeStatus']);
    Route::get('testimonial', [TestimonialController::class, 'index']);

    // Gallery Management Routes
    Route::post('gallery', [GalleryController::class, 'storeGallery']);
    Route::delete('gallery', [GalleryController::class, 'delete']);
    Route::get('gallery/list', [GalleryController::class, 'index']);

    // Faq Management Routes
    Route::post('faq', [FaqController::class, 'store']);
    Route::put('faq/update', [FaqController::class, 'update']);
    Route::delete('faq', [FaqController::class, 'delete']);

    // Settings Routes
    Route::post('settings', [SettingController::class, 'postSettings']);
    Route::get('settings', [SettingController::class, 'getSettings']);

    // Language Management Routes
    Route::get('language/list/admin', [LanguageController::class, 'adminIndex']);
    Route::post('language', [LanguageController::class, 'store']);
    Route::put('language', [LanguageController::class, 'update']);
    Route::get('language', [LanguageController::class, 'show']);
    Route::delete('language', [LanguageController::class, 'delete']);

    // Currency Management Routes
    Route::post('currency', [CurrencyController::class, 'store']);
    Route::put('currency', [CurrencyController::class, 'update']);
    Route::get('currency', [CurrencyController::class, 'show']);
    Route::delete('currency/delete', [CurrencyController::class, 'delete']);

    // Contact Management Routes
    Route::get('contact/list', [ContactController::class, 'index']);
    Route::get('contact{id?}', [ContactController::class, 'show']);
    Route::post('contact/reply', [ContactController::class, 'reply']);
    Route::delete('contact', [ContactController::class, 'delete']);

    // Newsletter Management Routes
    Route::get('newsletter', [NewsletterController::class, 'index']);
    Route::delete('newsletter', [NewsletterController::class, 'delete']);

    // Coupon Management Routes
    Route::get('coupon/admin/list', [CouponController::class, 'index']);
    Route::get('coupon', [CouponController::class, 'show']);
    Route::delete('coupon', [CouponController::class, 'delete']);
    Route::post('coupon', [CouponController::class, 'store']);
    Route::put('coupon/update', [CouponController::class, 'update']);
    Route::post('coupon/status', [CouponController::class, 'changeStatus']);

    // Product Category Management Routes
    Route::get('product/category', [ProductCategoryController::class, 'show']);
    Route::post('product/category', [ProductCategoryController::class, 'store']);
    Route::put('product/category', [ProductCategoryController::class, 'update']);
    Route::delete('product/category', [ProductCategoryController::class, 'delete']);

    // Product Management Routes
    Route::get('product/admin/list', [ProductController::class, 'index']);
    Route::get('product', [ProductController::class, 'show']);
    Route::delete('product', [ProductController::class, 'delete']);
    Route::post('product', [ProductController::class, 'store']);
    Route::put('product/update', [ProductController::class, 'update']);
    Route::post('product/publish', [ProductController::class, 'publishProduct']);

    // Blog Category Management Routes
    Route::get('blog/category', [BlogCategoryController::class, 'show']);
    Route::post('blog/category', [BlogCategoryController::class, 'store']);
    Route::put('blog/category/update', [BlogCategoryController::class, 'update']);
    Route::delete('blog/category', [BlogCategoryController::class, 'delete']);

    // Mail Credentials Routes
    Route::get('mail-credential', [MailCredentialController::class, 'show']);
    Route::post('mail-credential', [MailCredentialController::class, 'storeUpdate']);

    // Payment Method Management Routes
    Route::get('payment/method/list', [PaymentMethodController::class, 'index']);
    Route::post('payment/method', [PaymentMethodController::class, 'store']);
    Route::put('payment/method', [PaymentMethodController::class, 'update']);
    Route::post('payment/method/status', [PaymentMethodController::class, 'changeStatus']);
    Route::get('payment/method', [PaymentMethodController::class, 'show']);
    Route::delete('payment/method', [PaymentMethodController::class, 'delete']);

    // User Management RoutesN
    Route::get('user/list', [AuthController::class, 'userList']);
    Route::get('user/details', [AuthController::class, 'show']);


    // Event Management Routes
    Route::post('event', [EventController::class, 'store']);
    Route::put('event', [EventController::class, 'update']);
    Route::put('event/change-status', [EventController::class, 'changeStatus']);
    Route::delete('event', [EventController::class, 'delete']);
    Route::get('event', [EventController::class, 'index']);
    Route::get('event/interest/list', [EventController::class, 'interestedUsers']);
    Route::get('event/tickets/list', [EventController::class, 'ticketList']);
    Route::post('event/notice', [EventController::class, 'storeNotice']);
    Route::put('event/notice', [EventController::class, 'updateNotice']);
    Route::delete('event/notice', [EventController::class, 'deleteNotice']);


    //user details
    Route::get('user/details', [AuthController::class, 'show']);

    // Mail Credentials
    Route::get('mail-credential', [MailCredentialController::class, 'show']);
    Route::post('mail-credential', [MailCredentialController::class, 'storeUpdate']);


    // Product review
    Route::delete('product/review', [ProductReviewController::class, 'deleteReview']);
    Route::post('product/review/status', [ProductReviewController::class, 'changeStatus']);
    Route::get("product/review", [ProductReviewController::class, 'showReview']);
    Route::get("product/review/list", [ProductReviewController::class, 'index']);


    // Service review
    Route::delete('service/review', [ReviewController::class, 'deleteReview']);
    Route::post('service/review/status', [ReviewController::class, 'changeStatus']);
    Route::get("service/review", [ReviewController::class, 'showReview']);
    Route::get("service/review/list", [ReviewController::class, 'index']);


    //user list for admin
    Route::get('user/list', [AuthController::class, 'userList']);

    //user details
    Route::get('user/details', [AuthController::class, 'show']);

    //blog section admin
    Route::post('blog/toggle-publish', [BlogController::class, 'publish']);
    Route::post('blog/toggle-popular', [BlogController::class, 'popular']);

    // Blog Comment delete
    Route::delete('comment/delete-admin', [BlogCommentController::class, 'adminDelete']);

    //Service section admin
    Route::get('service/admin/list', [ServiceController::class, 'index']);
    Route::get('service/admin/details', [ServiceController::class, 'adminShow']);
    Route::post('service', [ServiceController::class, 'store']);
    Route::put('service', [ServiceController::class, 'Update']);
    Route::delete('service', [ServiceController::class, 'delete']);

    //enroll service admin
    Route::get('enroll/service/admin/list', [ServiceController::class, 'enrollList']);
    Route::delete('enroll/service/admin', [ServiceController::class, 'deleteEnroll']);
    //service faq
    Route::get('service/faq/admin/list', [ServiceFaqController::class, 'adminIndex']);
    Route::post('service/faq', [ServiceFaqController::class, 'store']);
    Route::put('service/faq', [ServiceFaqController::class, 'update']);
    Route::delete('service/faq', [ServiceFaqController::class, 'delete']);



    //package section admin
    Route::get('package/admin/list', [PackageController::class, 'adminIndex']);
    Route::post('package', [PackageController::class, 'store']);
    Route::put('package', [PackageController::class, 'update']);
    Route::delete('package', [PackageController::class, 'delete']);

    //package section admin
    Route::get('package/user/list', [BuyPackageController::class, 'adminIndex']);
    Route::delete('enroll/package', [BuyPackageController::class, 'delete']);

    //child section admin
    Route::get('children/admin/list', [ChildrenController::class, 'adminIndex']);

    //advertisement section admin
    Route::get('advertisement/list', [AdvertisementController::class, 'index']);
    Route::post('advertisement', [AdvertisementController::class, 'store']);
    Route::put('advertisement', [AdvertisementController::class, 'update']);
    Route::delete('advertisement', [AdvertisementController::class, 'delete']);

    //user status change
    Route::post('update/user/status', [AuthController::class, 'changeStatus']);

    //order list
    Route::get('admin/order/list', [OrderController::class, 'OrderList']);
    Route::get('admin/order/details', [OrderController::class, 'OrderDetails']);
    Route::post('order/change-status', [OrderController::class, 'statusUpdate']);
    Route::delete('order/delete', [OrderController::class, 'deleteOrder']);

    //buy package list
    Route::get('admin/buy-package/list', [BuyPackageController::class, 'buyPackageIndex']);
});
