<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\ReviewRequest;
use App\Http\Services\Common\ReviewService;
use Aws\Api\Service;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    //
     private $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function index(Request $request)
    {
        return $this->reviewService->index($request);
    }

    public function userIndex(Request $request)
    {
        return $this->reviewService->userIndex($request);
    }

    public function storeReview(ReviewRequest $request)
    {
            return $this->reviewService->store($request);
    }

    public function changeStatus(Request $request)
    {
        return $this->reviewService->changeStatus($request);
    }

    public function deleteReview(Request $request)

    {
        return $this->reviewService->delete($request);
    }
}
