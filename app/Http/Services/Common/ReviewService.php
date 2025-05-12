<?php

namespace App\Http\Services\Common;

use App\Http\Resources\Common\ServiceReviewResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\EnrollService;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewService
{
    public function makeData($request)
    {
        $userId = Auth::guard('checkUser')->user()->id;
        $data = [
            'user_id' => $userId,
            'service_id' => $request->service_id,
            'comment' => $request->comment,
            'rating' => $request->rating
        ];
        return $data;
    }


    // Service Review list for admin
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = Review::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        $data = ServiceReviewResource::collection($data);
        return successResponse(__('Service Review fetched successfully.'), new BasePaginationResource($data));

    }


    public function userIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = Review::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->where('status', '!=', '0')->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Service Review fetched successfully.'), ServiceReviewResource::collection($data));
    }


    public function store($request)
    {
        $userId = auth('checkUser')->user()->id; // Retrieve the authenticated user's ID

        // Check if the user purchased the product
        $purchase = EnrollService::where('user_id', $userId)
            ->where('service_id', $request->service_id) // Use correct variable name
            ->exists(); // Check if at least one matching record exists

        if (!$purchase) {
            return errorResponse(__('You have not enrolled this Service.'));
        }

        // Check if the user already reviewed the product
        $existingReview = Review::where('user_id', $userId)
            ->where('service_id', $request->service_id) // Use correct variable name
            ->exists(); // Check if a review already exists


        if ($existingReview) {
            return errorResponse(__('You have already reviewed this service.'));
        }

        // Create the review
        $review = Review::create([
            'user_id' => $userId,
            'service_id' => $request->service_id, // Use correct variable name
            'rating' => $request->rating, // Rating provided by the user
            'comment' => $request->comment, // Comment provided by the user
        ]);

        // Return a success response with the created review resource
        return successResponse(__('Review added successfully.'), $review);
    }


    public function changeStatus($request)
    {
        $review = Review::find($request->id);
        if (!$review) {
            return errorResponse(__('Review not found.'));
        }
        $review->status = $request->status;
        $review->save();
        return successResponse(__('Review status changed successfully.'));
    }



    // Delete review
    public function delete($request)
    {
        try {
            $review = Review::find($request->id);
            if (!$review) {
                return errorResponse(__('Review not found.'));
            }
            $review->delete();
            return successResponse(__('Review deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
