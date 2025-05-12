<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\OrderRequest;
use App\Http\Services\Common\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;

class OrderController extends Controller
{
    private $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function OrderList(Request $request)
    {
        return $this->orderService->adminIndex($request);
    }

    public function userOrderList(Request $request)
    {
        return $this->orderService->index($request);
    }

    public function OrderDetails(Request $request)
    {
        return $this->orderService->show($request);
    }

    public function show(Request $request)
    {
        return $this->orderService->show($request);
    }

    public function placeOrder(OrderRequest $request)
    {
        return $this->orderService->placeOrder($request);
    }

    //order status update
    public function statusUpdate(Request $request)
    {
        return $this->orderService->statusUpdate($request);
    }

    //order delete
    public function deleteOrder(Request $request)
    {
        return $this->orderService->deleteOrder($request);
    }
}
