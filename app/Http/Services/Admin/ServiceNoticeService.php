<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ServiceNoticeResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\EnrollService;
use App\Models\Service;
use App\Models\ServiceNotice;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ServiceNoticeService
{
    public function makeData($request)
    {
        $data = [
            'service_id' => $request->get('service_id'),
            'title' => json_encode($request->get('title')),
            'description' => json_encode($request->get('description')),
            'is_active' => $request->get('is_active') == 'true' ? 1 : 0
        ];
        return $data;
    }

    // All Notice list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Query ServiceNotice with active status check
        $data = ServiceNotice::where('service_id', $request->id)->where('is_active', 1);

        // Filter by service_id if 'service' is provided in the request
        $data->when(!empty($request->service_id), function ($q) use ($request) {
            return $q->where('service_id', $request->service_id);
        });

        // Filter by search keyword if provided
        $data->when(!empty($request->search), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('title', 'like', '%' . $request->search . '%');
            });
        });

        // Apply sorting and pagination
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(
            __('Notice fetched successfully.'),
            new BasePaginationResource(ServiceNoticeResource::collection($data))
        );
    }


    //admin index
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Query ServiceNotice
        $data = ServiceNotice::query();

        // Filter by service_id if 'service' is provided in the request
        $data->when(!empty($request->service_id), function ($q) use ($request) {
            return $q->where('service_id', $request->service_id);
        });

        // Filter by search keyword
        $data->when(!empty($request->search), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('title', 'like', '%' . $request->search . '%');
            });
        });

        // Apply sorting and pagination
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(
            __('Notice fetched successfully.'),
           ServiceNoticeResource::collection($data)        );
    }

    //enroll service notice list
    public function noticeList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Get the logged-in user's ID
        $userId = Auth::guard('checkUser')->id();

        if (!$userId) {
            return errorResponse(__('User not found.'));
        }

        // Fetch service IDs that belong to the logged-in user
        $serviceIds = EnrollService::where('user_id', $userId)->pluck('service_id');

        // Build the query
        $query = ServiceNotice::whereIn('service_id', $serviceIds)
            ->where('is_active', 1);

        // Apply search filter if provided
        if (!empty($request->search)) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Apply sorting and pagination
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        // Return the response
        return successResponse(
            __('Notice fetched successfully.'),
            new BasePaginationResource(ServiceNoticeResource::collection($data))
        );
    }



    // Single Notice
    public function show($request)
    {
        $notice = ServiceNotice::find($request->id);
        if (!$notice) {
            return errorResponse(__('Notice not found.'));
        }
        return successResponse(__('Notice fetched successfully.'), ServiceNoticeResource::make($notice));
    }

    // Store Notice
    public function store($request)
    {
        $service = Service::find($request->service_id);
        if (!$service) {
            return errorResponse(__('Service not found.'));
        }

        $data = $this->makeData($request);

        $user_id = auth('checkUser')->user()->id;
        $user_role = auth('checkUser')->user()->role;

        $data['user_id'] = $user_id;
        $data['role'] = $user_role;

        try {
            ServiceNotice::create($data);

            $enrolledUsers = EnrollService::where('service_id', $request->service_id)
                ->with('user')
                ->get();

            // Send notifications to each enrolled user
            foreach ($enrolledUsers as $enrollment) {
                $user = $enrollment->user;
                if ($user) {
                    sendNotification(
                        $user->id,
                        __('You have a new notice in ' . $service->name . ' service: ') . $service->name,
                        'Service Notice',
                        $service->image
                    );
                }
            }

            return successResponse(__('Notice for service created successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Update Notice
    public function update($request)
    {
        $notice = ServiceNotice::where('id', $request->id)->first();

        if (!$notice) {
            return errorResponse(__('Notice not found.'));
        }

        try {
            // Update the service
            if ($request->has('is_active') && count($request->all()) === 2) {
                $notice->update(['is_active' => $request->is_active]);
            } else {
                // Update the full dataset
                $data = $this->makeData($request);
                $notice->update($data);
            }

            return successResponse(__('Service updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Delete notice
    public function delete($request)
    {
        try {
            $notice = ServiceNotice::where('user_id', auth('checkUser')->user()->id)->find($request->id);
            if (!$notice) {
                return errorResponse(__('Notice not found.'));
            }
            $notice->delete();
            return successResponse(__('Notice deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
