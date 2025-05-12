<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ServiceAdminResource;
use App\Http\Resources\Admin\ServiceNoticeResource;
use App\Http\Resources\Admin\ServiceResource;
use App\Http\Resources\Common\EnrollServiceResource;
use App\Http\Resources\Common\NoticeResource;
use App\Http\Resources\Common\ServiceTrainerResource;
use App\Http\Resources\Common\TrainerResource;
use App\Http\Resources\Common\UserEnrollResourse;
use App\Http\Resources\Common\UserEnrollService;
use App\Http\Resources\Common\UserResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\BuyPackage;
use App\Models\Children;
use App\Models\EnrollService;
use App\Models\Service;
use App\Models\ServiceNotice;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ServiceService
{
    public function makeData($request)
    {
        if ($request->discount_type == "percentage") {
            $discountprice = $request->price - ($request->price * ($request->discount / 100));
        } else {
            $discountprice = $request->price - $request->discount;
        }
        $data = [
            'name' => $request->get('name') ? json_encode($request->get('name')) : null,
            'title' => $request->get('title') ? json_encode($request->get('title')) : null,
            'description' => $request->get('description') ? json_encode($request->get('description')) : null,
            'image' => $request->get('image'),
            'instructor_id' => $request->get('instructor_id') ?? null,
            'price' => $request->get('price') ?? 0.00,
            'discount_price' => $discountprice ?? 0.00,
            'discount' => $request->get('discount') ?? 0.00,
            'discount_type' => $request->get('discount_type') ?? null,
            'category' => $request->get('category') ? json_encode($request->get('category')) : null,
            'session' => $request->get('session') ?? null,
            'duration' => $request->get('duration') ?? null,
            'capacity' => $request->get('capacity') ?? null,
            'service_news' => $request->get('service_news') ? json_encode($request->get('service_news')) : null,
            'is_active' => $request->get('is_active') == 'true' ? 1 : 0
        ];

        return $data;
    }


    //per user list
    public function perUserList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $userId = Auth::guard('checkUser')->user()->id;

        // Step 1: Fetch services directly enrolled by the user
        $data = EnrollService::query()
            ->where('user_id', $userId)
            ->where('is_paid', 1)
            ->whereHas('service', function ($q) {
                $q->where('is_active', 1); // Ensure the service is active
            })
            ->with('service');

        // Step 3: Fetch and paginate the services
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(
            __('Service fetched successfully.'),
            new BasePaginationResource(UserEnrollResourse::collection($data))
        );
    }


    // All Service
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        $data = Service::query();

        // Apply search filter
        $data->when($request->search, function ($q) use ($request, $lang) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $q->where(function ($q) use ($searchTerm, $lang) {
                // Search the 'name', 'title', and 'description' fields in the given language
                $q->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`name`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                )
                ->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`title`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                )
                ->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`description`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                );
            });
        });

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Service fetched successfully.'),
            new BasePaginationResource(ServiceAdminResource::collection($data))
        );
    }


    //enroll service list
    public function enrollList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        // Start the query from the EnrollService model
        $data = EnrollService::query();

        // Join the related tables for searching
        $data->leftJoin('services', 'enroll_services.service_id', '=', 'services.id')
            ->leftJoin('users', 'enroll_services.user_id', '=', 'users.id');

        // Apply search filter
        $data->when($request->search, function ($q) use ($request, $lang) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $q->where(function ($q) use ($searchTerm, $lang) {
                $q->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(services.name, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                )
                ->orWhereRaw('LOWER(users.name) LIKE ?', [$searchTerm])
                ->orWhereRaw('LOWER(enroll_services.method) LIKE ?', [$searchTerm]);
            });
        });

        // Apply sorting and pagination
        $data = $data->select('enroll_services.*')->orderBy($sort_by, $dir)->paginate($per_page);

        // Return the formatted response
        return successResponse(
            __('Service fetched successfully.'),
            new BasePaginationResource(EnrollServiceResource::collection($data))
        );
    }




    //trainer index
    public function trainerIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $trainerId = Auth::guard('checkUser')->user()->id;
        $data = Service::query()->where('instructor_id',$trainerId);

        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Trainer fetched successfully.'),new BasePaginationResource(ServiceResource::collection($data)));

    }

    //service trainer details
    public function instructorDetails($request)
    {
        $trainer = User::find($request->id);
        if (! $trainer) {
            return errorResponse(__('Trainer not found.'));
        }
        return successResponse(__('Trainer details fetched successfully.'), TrainerResource::make($trainer));
    }


    //user index
    public function userIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id'; // Default sorting column
        $dir = $request->dir ?? 'desc'; // Default sorting direction
        $per_page = $request->limit ?? PERPAGE_PAGINATION; // Default pagination limit
        $lang = $request->langCode ?? 'en'; // Default language

        // Base query for active services
        $data = Service::query()->where('is_active', 1);

        // Apply search filter
        $data->when(!empty($request->search), function ($q) use ($request, $lang) {
            $searchTerm = '%' . strtolower($request->search) . '%';

            $q->where(function ($q) use ($searchTerm, $lang) {
                $q->whereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`name`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                )
                ->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`title`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                )
                ->orWhereRaw(
                    "LOWER(JSON_UNQUOTE(JSON_EXTRACT(`description`, '$.{$lang}'))) LIKE ?",
                    [$searchTerm]
                );
            });
        });

        // Apply sorting and pagination
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        // Return the formatted response
        return successResponse(
            __('Service fetched successfully.'),
            new BasePaginationResource(ServiceResource::collection($data))
        );
    }


    // Single Service
    public function show($request)
    {
        $service = Service::find($request->id);
        if (! $service) {
            return errorResponse(__('Service not found.'));
        }

        return successResponse(__('Service fetched successfully.'), ServiceResource::make($service));
    }


    public function adminShow($request)
    {
        $service = Service::find($request->id);
        if (! $service) {
            return errorResponse(__('Service not found.'));
        }

        return successResponse(__('Service fetched successfully.'), ServiceAdminResource::make($service));
    }

    // Store Service
    public function store($request)
    {
        $payload = $request->input('name');

        // Validate the input to ensure it is not empty and is an array
        if (empty($payload) || !is_array($payload)) {
            return response()->json(['message' => 'Invalid input'], 400);
        }

        $query = Service::query();

        // Iterate through each language and check if a service with the same name exists
        foreach ($payload as $lang => $value) {
            $query->orWhere("name->$lang", $value);
        }
        $exists = $query->exists();
        if ($exists) {
            return errorResponse(__('Service already exists.'));
        }

        $data = $this->makeData($request);

        if ($data['discount_type'] == 'percentage') {
            $data['discount_price'] = $data['price'] * (1 - $data['discount'] / 100);
        } else {
            $data['discount_price'] = $data['price'] - $data['discount'];
        }

        $service = Service::create($data);

        return successResponse(__('Service created successfully.'), $service);
    }




    // Update Service
    public function update($request)
    {
        $service = Service::find($request->id);
        if (! $service) {
            return errorResponse(__('service not found.'));
        }

        try {
            // Update the service
            if ($request->has('is_active') && count($request->all()) === 2) { // `id` and `is_active`
                $service->update(['is_active' => $request->is_active]);
            } else {
                // Update the full dataset
                $data = $this->makeData($request);
                $service->update($data);
            }

            return successResponse(__('Service updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Delete service
    public function delete($request)
    {
        try {
            $service = Service::find($request->id);
            if (! $service) {
                return errorResponse(__('Service not found.'));
            }
            $service->delete();
            removeFile($service->image);

            return successResponse(__('Service deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // interested users
    public function interest($request)
    {
        $service = Service::find($request->id);
        if (! $service) {
            return errorResponse(__('Service not found.'));
        }
        $user_id = Auth::guard('checkUser')->user();
        $user = User::find($user_id->id);
        $alreay_interested_users = $service->interested_users;
        if (in_array($user->id, $alreay_interested_users)) {
            // remove user from interested users
            $alreay_interested_users = array_diff($alreay_interested_users, [$user->id]);
            $service->update(['total_interested_users' => count($alreay_interested_users), 'interested_users' => $alreay_interested_users]);
            return successResponse(__('we are sorry to inform you that you have been removed from the list of interested users.'));
        }
        // total interested users
        $total_interested_users = count($service->interested_users) + 1;
        // add user to interested users
        array_push($alreay_interested_users, $user->id);
        $service->update(['total_interested_users' => $total_interested_users, 'interested_users' => $alreay_interested_users]);
        return successResponse(__('Thanks for your interest.'));
    }

    public function interestedUsers($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $service = Service::find($request->id);
        if (! $service) {
            return errorResponse(__('Service not found.'));
        }
        // if se
        $interested_users = $service->interested_users;
        $users = User::whereIn('id', $interested_users)->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Service interested users fetched successfully.'), new BasePaginationResource(UserResource::collection($users)));
    }

    // join by user
    public function joinByUser($request)
    {
        $enroll_service = EnrollService::find($request->id);

        if (!$enroll_service) {
            return errorResponse(__('Service not found.'));
        }

        $user_id = Auth::guard('checkUser')->user();

        // Check if the child exists and belongs to the user
        if (Children::where('id', $request->child_id)->where('user_id', $user_id->id)->exists()) {
            // Update the EnrollService with the new child_id
            $enroll_service->update(['child_id' => $request->child_id]);

            // After updating the EnrollService, update the Children table with the service_id from EnrollService
            $child = Children::find($request->child_id);

            if ($child) {
                // Get the service_id from EnrollService (the service_id of the specific EnrollService)
                $service_id = $enroll_service->service_id;

                // Get the existing service_ids from the Children table (if any)
                $existing_service_ids = json_decode($child->service_id, true) ?: [];

                // Ensure that service_id is an integer (or string-like integer) before adding it
                if (!in_array($service_id, $existing_service_ids, true)) {
                    $existing_service_ids[] = (int)$service_id;
                }

                // Update the service_id field (encode as JSON array of integers)
                $child->update(['service_id' => json_encode($existing_service_ids, JSON_NUMERIC_CHECK)]);

                return successResponse(__('Child assigned and service updated successfully.'));
            } else {
                return errorResponse(__('Child not found.'));
            }
        } else {
            return errorResponse(__('Child not found.'));
        }
    }





    public function noticeList($request){
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $notice = ServiceNotice::where('service_id', $request->id)->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Service interested users fetched successfully.'), new BasePaginationResource(ServiceNoticeResource::collection($notice)));
    }


    //delete Enroll service
    public function deleteEnroll($request)
    {
        try {
            $enroll_service = EnrollService::find($request->id);
            if (! $enroll_service) {
                return errorResponse(__('Enroll service not found.'));
            }
            $enroll_service->delete();

            return successResponse(__('Enroll service deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }
}
