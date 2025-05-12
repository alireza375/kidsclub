<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceFaqRequest;
use App\Http\Services\Admin\ServiceFaqService;
use Aws\Api\ServiceFaq;
use Illuminate\Http\Request;

class ServiceFaqController extends Controller
{
    //
     private $faqService;

    public function __construct(ServiceFaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    public function index(Request $request)
    {
        return $this->faqService->index($request);
    }

    //admin index
    public function adminIndex(Request $request)
    {
        return $this->faqService->adminIndex($request);
    }

    public function store(ServiceFaqRequest $request)
    {
            return $this->faqService->store($request);
    }

    public function update(Request $request)
    {
        return $this->faqService->update($request);
    }

    public function show(Request $request)
    {
        return $this->faqService->show($request);
    }

    public function delete(Request $request)
    {
        return $this->faqService->delete($request);
    }
}
