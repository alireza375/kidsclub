<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PaymentMethodRequest;
use App\Http\Services\Admin\PaymentMethodService;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    private $methodService;

    public function __construct(PaymentMethodService $methodService)
    {
        $this->methodService = $methodService;
    }

    //index
    public function index(Request $request)
    {
        return $this->methodService->index($request);
    }
    //index
    public function publicIndex(Request $request)
    {
        return $this->methodService->publicIndex($request);
    }

    //
    public function paymentMethodList(Request $request)
    {
        return $this->methodService->paymentMethodList($request);
    }

    // user index
    public function userIndex(Request $request)
    {
        return $this->methodService->userIndex($request);
    }

    //show
    public function show(Request $request)
    {
        return $this->methodService->show($request);
    }

    //store
    public function store(PaymentMethodRequest $request)
    {
        return $this->methodService->store($request);
    }


    // update
    public function update(Request $request)
    {
        return $this->methodService->update($request);
    }


    // change status
    public function changeStatus(Request $request)
    {
        return $this->methodService->changeStatus($request);
    }


    //delete
    public function delete(Request $request)
    {
        return $this->methodService->delete($request);
    }
}
