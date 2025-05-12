<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\FaqResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Faq;

class FaqService
{
    public function makeData($request)
    {
        $data = [
            'question' => $request->get('question') ? json_encode($request->get('question')) : null,
            'answer' => $request->get('answer') ? json_encode($request->get('answer')) : null
        ];
        return $data;
    }

    // All faq list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Faq::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('question', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Faq fetched successfully.'), new BasePaginationResource(FaqResource::collection($data)));
    }

    // Single faq
    public function show($request)
    {
        $faq = Faq::find($request->id);
        if (!$faq) {
            return errorResponse(__('Faq not found.'));
        }
        return successResponse(__('Faq fetched successfully.'), FaqResource::make($faq));
    }

    // Store faq
    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            $faq = Faq::create($data);
            return successResponse(__('Faq created successfully.'), $faq);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Update faq
    public function update($request)
    {
        $faq = Faq::find($request->id);
        if (!$faq) {
            return errorResponse(__('Faq not found.'));
        }
        $data = $this->makeData($request);
        try {
            $faq->update($data);
            return successResponse(__('Faq updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Delete faq
    public function delete($request)
    {
        try {
            $faq = Faq::find($request->id);
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
