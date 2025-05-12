<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ServiceFaqResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\ServiceFaq;

class ServiceFaqService
{
    public function makeData($request)
    {
        $data = [
            'question' => $request->get('question') ? json_encode($request->get('question')) : null,
            'answer' => $request->get('answer') ? json_encode($request->get('answer')) : null,
            'service_id' => $request->get('service_id') ?? null,
            'is_active' => $request->get('is_active') == 'true' ? 1 : 0
        ];
        return $data;
    }

    // All faq list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        // Query active ServiceFaqs
        $data = ServiceFaq::query()->where('is_active', 1);

        // Filter by service_id if 'service' is provided in the request
        $data->when(!empty($request->service_id), function ($q) use ($request) {
            return $q->where('service_id', $request->service_id);
        });

        // Filter by search keyword
        $data->when(!empty($request->search), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('question', 'like', '%' . $request->search . '%');
            });
        });

        // Apply sorting and pagination
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(
            __('Faq fetched successfully.'),
            new BasePaginationResource(ServiceFaqResource::collection($data))
        );
    }


    //admin index
    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $data = ServiceFaq::query();

        // Filter by service_id if 'service' is provided in the request
        $data->when(!empty($request->service_id), function ($q) use ($request) {
            return $q->where('service_id', $request->service_id);
        });

        // Filter by search keyword
        $data->when(!empty($request->search), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('question', 'like', '%' . $request->search . '%');
            });
        });

        // Apply sorting and pagination
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(
            __('Faq fetched successfully.'),
            new BasePaginationResource(ServiceFaqResource::collection($data))
        );
    }


    // Single faq
    public function show($request)
    {
        $faq = ServiceFaq::find($request->id);
        if (!$faq) {
            return errorResponse(__('Faq not found.'));
        }
        return successResponse(__('Faq fetched successfully.'), ServiceFaqResource::make($faq));
    }

    // Store faq
    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            ServiceFaq::create($data);
            return successResponse(__('Faq for service created successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Update faq
    public function update($request)
    {
        $faq = ServiceFaq::find($request->id);
        if (!$faq) {
            return errorResponse(__('Faq not found.'));
        }
        try {
            // Update the service
            if ($request->has('is_active') && count($request->all()) === 2) { // `id` and `is_active`
                $faq->update(['is_active' => $request->is_active]);
            } else {
                // Update the full dataset
                $data = $this->makeData($request);
                $faq->update($data);
            }

            return successResponse(__('Service updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Delete faq
    public function delete($request)
    {
        try {
            $faq = ServiceFaq::where('service_id', $request->service_id)->find($request->id);
            if (!$faq) {
                return errorResponse(__('Faq not found.'));
            }
            $faq->delete();
            return successResponse(__('Faq deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
