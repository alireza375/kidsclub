<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\EnrollServiceRequest;
use App\Http\Services\Common\EnrollServiceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class EnrollServiceController extends Controller
{
    private $enrollService;

    public function __construct(EnrollServiceService $enrollService)
    {
        $this->enrollService = $enrollService;
    }

    public function OrderList(Request $request)
    {
        return $this->enrollService->adminIndex($request);
    }

    public function userOrderList(Request $request)
    {
        return $this->enrollService->index($request);
    }

    public function OrderDetails(Request $request)
    {
        return $this->enrollService->show($request);
    }

    public function show(Request $request)
    {
        return $this->enrollService->show($request);
    }

    public function enroll(EnrollServiceRequest $request)
    {
        return $this->enrollService->enroll($request);
    }

    //order status update
    public function statusUpdate(Request $request)
    {
        return $this->enrollService->statusUpdate($request);
    }
}
