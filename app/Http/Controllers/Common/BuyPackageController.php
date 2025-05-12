<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\BuyPackageRequest;
use App\Http\Services\Common\BuyPackageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class BuyPackageController extends Controller
{
    private $buyPackageService;

    public function __construct(BuyPackageService $buyPackageService)
    {
        $this->buyPackageService = $buyPackageService;
    }

    public function adminIndex(Request $request)
    {
        return $this->buyPackageService->adminIndex($request);
    }

    public function userPackage(Request $request)
    {
        return $this->buyPackageService->userPackage($request);
    }

    //buy package list
    public function buyPackageIndex(Request $request)
    {
        return $this->buyPackageService->buyPackageIndex($request);
    }


    public function show(Request $request)
    {
        return $this->buyPackageService->show($request);
    }

    public function buyPackage(BuyPackageRequest $request)
    {
        return $this->buyPackageService->buyPackage($request);
    }

    //order status update
    public function statusUpdate(Request $request)
    {
        return $this->buyPackageService->statusUpdate($request);
    }

    //enroll package delete
    public function delete(Request $request)
    {
        return $this->buyPackageService->delete($request);
    }
}
