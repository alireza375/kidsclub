<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\NewsletterResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Newsletter;

class NewsletterService
{
    public function makeData($request)
    {
        $data = [
            'email' => $request->get('email'),
            'status' => $request->get('status') ? false : true
        ];
        return $data;
    }

    // All newsletter
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Newsletter::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('question', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Successfully fetched newsletters'), new BasePaginationResource(NewsletterResource::collection($data)));
    }


    // Store newsletter
    public function subscribe($request)
    {
        $data = $this->makeData($request);
        try {
            $sub = Newsletter::where('email', $data['email'])->first();
            if ($sub) {
                return errorResponse(__('Already subscribed'));
            }
            Newsletter::create($data);
            return successResponse(__('Successfully subscribed'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Delete newsletter
    public function delete($request)
    {
        try {
            $newsletter = Newsletter::find($request->id);
            if (!$newsletter) {
                return errorResponse(__('newsletter not found.'));
            }
            $newsletter->delete();
            return successResponse(__('newsletter deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
