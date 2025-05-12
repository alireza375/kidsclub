<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProductReviewRequest;
use App\Http\Services\Common\ProductReviewService;
use App\Models\ProductReview;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    //
    private $productReviewService;

    public function __construct(ProductReviewService $productReviewService)
    {
        $this->productReviewService = $productReviewService;
    }


    public function index(Request $request)
    {
        return $this->productReviewService->index($request);
    }


    public function userIndex(Request $request)
    {
        return $this->productReviewService->userIndex($request);
    }

    public function storeReview(ProductReviewRequest $request)
    {
        return $this->productReviewService->store($request);
    }

    public function showReview(Request $request)
    {
        return $this->productReviewService->show($request);
    }

    public function changeStatus(Request $request)
    {
        return $this->productReviewService->changeStatus($request);
    }

    public function deleteReview(Request $request)
    {
        return $this->productReviewService->delete($request);
    }


}
