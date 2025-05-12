<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\JoinEventRequest;
use App\Http\Services\Common\JoinEventService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class JoinEventController extends Controller
{
    private $joinEventService;

    public function __construct(JoinEventService $joinEventService)
    {
        $this->joinEventService = $joinEventService;
    }

    public function OrderList(Request $request)
    {
        return $this->joinEventService->adminIndex($request);
    }

    public function userOrderList(Request $request)
    {
        return $this->joinEventService->index($request);
    }

    public function OrderDetails(Request $request)
    {
        return $this->joinEventService->show($request);
    }

    public function show(Request $request)
    {
        return $this->joinEventService->show($request);
    }

    public function joinEvent(JoinEventRequest $request)
    {
        return $this->joinEventService->joinEvent($request);
    }

    //order status update
    public function statusUpdate(Request $request)
    {
        return $this->joinEventService->statusUpdate($request);
    }
}
