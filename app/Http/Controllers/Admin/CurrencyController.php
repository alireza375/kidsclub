<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CurrencyRequest;
use App\Http\Services\Admin\CurrencyService;
use Illuminate\Http\Request;

class CurrencyController extends Controller
{
    public $currencyService;
    public function __construct(CurrencyService $currencyService)
    {
        $this->currencyService = $currencyService;
    }

    // index for admin
    public function index(Request $request)
    {
        return $this->currencyService->index($request);
    }

    // show
    public function show(Request $request)
    {
        return $this->currencyService->show($request);
    }

    // store
    public function store(CurrencyRequest $request)
    {
        return $this->currencyService->store($request);
    }


    // update
    public function update(CurrencyRequest $request)
    {
        return $this->currencyService->update($request);
    }


    // delete
    public function delete(Request $request)
    {
        return $this->currencyService->delete($request);
    }

}
