<?php

namespace App\Http\Services\Common;

use App\Http\Resources\Common\ChildrenAdminResource;
use App\Http\Resources\Common\ChildrenResource;
use App\Http\Resources\Common\ChildrenTrainerResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Children;
use App\Models\Faq;
use App\Models\Service;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class ChildrenService
{
    public function makeData($request)
    {
        $user = Auth::guard('checkUser')->user()->id;

        // Format the dob to 'Y-m-d' format using Carbon
        $dob = Carbon::parse($request->get('date_of_birth'))->addDay()->format('Y-m-d');

        return [
            'user_id' => $user,
            'name' => $request->get('name'),
            'dob' => $dob,
            'relation_type' => $request->get('relation_type'),
            'image' => $request->get('image'),
            'service_id' => $request->get('service_id') ? json_encode($request->get('service_id')) : null,
        ];
    }

    //admin children list
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = Children::query();

        // Apply search filter if provided
        $data->when(!empty($request->search), function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%');
        });

        $children = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Children fetched successfully.'), new BasePaginationResource(ChildrenAdminResource::collection($children)));
    }

    //trainer children list
    public function childrenIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $trainerId = Auth::guard('checkUser')->user()->id;

        $data = Service::query()
            ->where('instructor_id', $trainerId);

        // Apply search filter if provided
        $data->when(!empty($request->search), function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%');
        });

        // Fetch paginated data
        $services = $data->orderBy($sort_by, $dir)->paginate($per_page);

        // Filter out services with empty children arrays
        $filteredServices = $services->getCollection()->filter(function ($service) {
            $resource = new ChildrenTrainerResource($service);
            $data = $resource->toArray(request());
            return !empty($data['children']);
        });

        // Replace the original collection with the filtered one
        $services->setCollection($filteredServices);

        return successResponse(
            __('Children fetched successfully.'),
            new BasePaginationResource(ChildrenTrainerResource::collection($services))
        );
    }


    /**
     * Get all children with pagination and optional search.
     */
    public function index($request)
    {
        $userId = Auth::guard('checkUser')->user()->id;

        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = Children::query()->where('user_id', $userId);

        // Apply search filter if provided
        $data->when(!empty($request->search), function ($q) use ($request) {
            $q->where('name', 'like', '%' . $request->search . '%');
        });

        $children = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Children fetched successfully.'), new BasePaginationResource(ChildrenResource::collection($children)));
    }


    /**
     * Get a single child by ID.
     */
    public function show($request)
    {
        $child = Children::find($request->id);
        if (!$child) {
            return errorResponse(__('Child not found.'));
        }
        return successResponse(__('Child fetched successfully.'), new ChildrenResource($child));
    }

    /**
     * Store a new child record.
     */
    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            $child = Children::create($data);
            return successResponse(__('Child created successfully.'), $child);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    /**
     * Update an existing child record.
     */
    public function update($request)
    {
        $child = Children::find($request->id);

        if (!$child) {
            return errorResponse(__('Child not found.'));
        }

        $data = [];

        // Update service_id if provided
        if ($request->has('service_id')) {
            $existingServiceIds = json_decode($child->service_id, true);

            // If the decoded value is not an array, initialize it as an empty array
            if (!is_array($existingServiceIds)) {
                $existingServiceIds = [];
            }
            // Get new service_id from the request
            $newServiceIds = $request->get('service_id');

            // Ensure the new service_id is always an array
            if (!is_array($newServiceIds)) {
                $newServiceIds = [$newServiceIds]; // Convert to array if it's a single value
            }

            // Merge and remove duplicates
            $mergedServiceIds = array_unique(array_merge($existingServiceIds, $newServiceIds));

            // Update the service_id in the data array
            $data['service_id'] = json_encode($mergedServiceIds);
        }

        // Update name if provided
        if ($request->has('name')) {
            $data['name'] = $request->get('name');
        }

        // Update relation_type if provided
        if ($request->has('relation_type')) {
            $data['relation_type'] = $request->get('relation_type');
        }

        // Update image if provided
        if ($request->has('image')) {
            $data['image'] = $request->get('image');
        }

        // Update other fields if provided
        if ($request->has('date_of_birth')) {
            $dob = Carbon::parse($request->get('date_of_birth'))->addDay()->format('Y-m-d');
            $data['dob'] = $dob;
        }

        try {
            // Update the child record
            $child->update($data);

            return successResponse(__('Child updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }





    /**
     * Delete a child record.
     */
    public function delete($request)
    {
        try {
            // Find the child by the provided ID
            $child = Children::find($request->id);

            // Check if the child exists
            if (!$child) {
                return errorResponse(__('Child not found.'));
            }

            // Check if the authenticated user is the owner of the child record
            if ($child->user_id != Auth::guard('checkUser')->user()->id) {
                return errorResponse(__('You can only delete your own children.'));
            }

            // Delete the child record
            $child->delete();

            // Remove the associated image file (if exists)
            removeFile($child->image);

            // Return success response
            return successResponse(__('Child deleted successfully.'));
        } catch (\Exception $e) {
            // Return error response in case of an exception
            return errorResponse($e->getMessage());
        }
    }


}
