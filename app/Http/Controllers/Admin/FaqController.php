<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FaqRequest;
use App\Http\Services\Admin\FaqService;
use Aws\Api\Service;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    //
     private $faqService;

    public function __construct(FaqService $faqService)
    {
        $this->faqService = $faqService;
    }

    public function index(Request $request)
    {
        return $this->faqService->index($request);
    }

    public function store(FaqRequest $request)
    {
            return $this->faqService->store($request);
    }

    public function update(FaqRequest $request)
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
