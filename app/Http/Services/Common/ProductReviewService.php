<?php

namespace App\Http\Services\Common;

use App\Http\Resources\Common\ProductReviewResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\OrderProduct;
use App\Models\ProductReview;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Mollie\Api\Resources\Order;

class ProductReviewService
{

    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = ProductReview::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        $data = ProductReviewResource::collection($data);
        return successResponse(__('Product Review fetched successfully.'), new BasePaginationResource($data));

    }


    public function userIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = ProductReview::query()->where('status', 1);
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Product Review fetched successfully.'), ProductReviewResource::collection($data));


    }

    public function show($request)
    {
        $data = ProductReview::find($request->id);
        if (!$data) {
            return errorResponse(__('Review not found.'));
        }
        return successResponse(__('Review fetched successfully.'), ProductReviewResource::make($data));
    }

    public function store($request)
    {
        $userId = auth('checkUser')->user()->id; // Retrieve the authenticated user's ID
        // return $userId;
        // Check if the user purchased the product
        $purchase = OrderProduct::where('user_id', $userId)->where('status', "completed")
            ->whereRaw("JSON_CONTAINS(items, JSON_OBJECT('productId', ?))", [$request->product_id])
            ->exists();

        if (!$purchase) {
            return errorResponse(__('You have not purchased this product.'));
        }
        $existingReview = ProductReview::where('user_id', $userId)
            ->where('product_id', $request->product_id)
            ->exists();

        if ($existingReview) {
            return errorResponse(__('You have already reviewed this product.'));
        }
        $review = ProductReview::create([
            'user_id' => $userId,
            'product_id' => $request->product_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
        return successResponse(__('Review added successfully.'), ProductReviewResource::make($review));
    }



    public function changeStatus($request)
    {
        $review = ProductReview::find($request->id);
        if (!$review) {
            return errorResponse(__('Review not found.'));
        }
        $review->status = $request->status;
        $review->save();
        return successResponse(__('Review status changed successfully.'));
    }

    // delete review
    public function delete($request)
    {
        try {
            $review = ProductReview::find($request->id);
            if (!$review) {
                return errorResponse(__('Review not found.'));
            }
            $review->delete();
            removeFile($review->image);
            return successResponse(__('Review deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
