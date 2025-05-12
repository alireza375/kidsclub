<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CouponRequest;
use App\Http\Services\Admin\CouponService;
use Illuminate\Http\Request;

class CouponController extends Controller
{
    //
    private $couponService;

    public function __construct(CouponService $couponService)
    {
        $this->couponService = $couponService;
    }


    // index coupon list for admin
    public function index(Request $request)
    {
        return $this->couponService->index($request);
    }

    //coupon list for all
    public function couponList(Request $request)
    {
        return $this->couponService->couponList($request);
    }


    // Single Coupon
    public function show(Request $request)
    {
        return $this->couponService->show($request);
    }


    // Store Coupon
    public function store(CouponRequest $request)
    {
        return $this->couponService->store($request);
    }


    // Update Coupon
    public function update(CouponRequest $request)
    {
        return $this->couponService->update($request);
    }


    // Delete Coupon
    public function delete(Request $request)
    {
        return $this->couponService->delete($request);
    }


    // coupon Change Status
    public function changeStatus(Request $request)
    {
        return $this->couponService->changeStatus($request);
    }


    //apply coupon
    public function applyCoupon(Request $request)
    {
        return $this->couponService->applyCoupon($request);
    }
}
