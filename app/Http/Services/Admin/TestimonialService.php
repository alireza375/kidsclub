<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\TestimonialResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Testimonial;

class TestimonialService
{
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = Testimonial::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        $data = TestimonialResource::collection($data);
        return successResponse(__('Testimonial fetched successfully.'), new BasePaginationResource($data));
    }


    public function userIndex($request)
    {
        $data = Testimonial::where(['status' => 1])->get();
        // $data->where('status', 1);

        $data = TestimonialResource::collection($data);
        return successResponse(__('Testimonial fetched successfully.'), $data);

    }


    // Store a new testimonial
    public function store($request)
    {
        $data = [
            'name' => $request->name,
            'description' => json_encode($request->description),
            'image' => $request->image,
            'rating' => $request->rating
        ];

        try {
            $testi = Testimonial::create($data);
            return successResponse(__('Testimonial created successfully'), $testi);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Update a testimonial
    public function update($request,)
    {
        // Find the testimonial by its ID
        $testi = Testimonial::find($request->id);

        // Check if the testimonial exists
        if (!$testi) {
            return errorResponse(__('Testimonial not found'));
        }

        // Prepare the data to be updated
        $data = [
            'name' => $request->name ?? $testi->name,
            'description' => json_encode($request->description) ?? $testi->description,
            'rating' => $request->rating ?? $testi->rating
        ];

        // If an image is provided, include it in the update data
        if ($request->has('image')) {
            $data['image'] = $request->image;
        }

        try {
            // Update the testimonial record
            $testi->update($data);

            // Return a success response
            return successResponse(__('Testimonial updated successfully'), $testi);
        } catch (\Exception $e) {
            // Catch any errors and return a failure response
            return errorResponse($e->getMessage());
        }
    }


    // Delete a testimonial
    public function delete($request)
    {
        $testi = Testimonial::find($request->id);
        if (! $testi) {
            return errorResponse(__('Testimonial not found'));
        }
        try {
            $testi->delete();
            removeFile($testi->image);
            return successResponse(__('Testimonial deleted successfully'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    public function changeStatus($request)
    {
        $testi = Testimonial::find($request->id);
        if (!$testi) {
            return errorResponse(__('Testimonial not found'));
        }
        try {
            $testi->update(['status' => $testi->status == 1 ? 0 : 1]);
            return successResponse(__('Testimonial status updated successfully'), $testi);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



}
