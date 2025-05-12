<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\AdvertisementResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Advertisement;

class AdvertisementService
{
    public function makeData($request)
    {
        $data = [
            'title' => $request->get('title'),
            'description' => $request->get('description'),
            'image' => $request->get('image'),
            'status' => $request->get('status')=='active' ? 1 : 0,
        ];
        return $data;
    }

    // All Advertisement list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Advertisement::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('question', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Advertisement fetched successfully.'), new BasePaginationResource(AdvertisementResource::collection($data)));
    }

    // Single Advertisement
    public function show($request)
    {
        $advertisement = Advertisement::find($request->id);
        if (!$advertisement) {
            return errorResponse(__('Advertisement not found.'));
        }
        return successResponse(__('Advertisement fetched successfully.'),AdvertisementResource::make($advertisement));
    }

    // Active Advertisement
    public function activeAd($request)
    {
        $advertisement = Advertisement::where('status', 1)->first(['image']);

        if (!$advertisement) {
            return errorResponse(__('No active advertisements found.'));
        }

        return successResponse(__('Active advertisements fetched successfully.'), $advertisement);
    }



    // Store Advertisement
    public function store($request)
    {

        $data = $this->makeData($request);
        try {
            $advertisement = Advertisement::create($data);
            return successResponse(__('Advertisement created successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Update Advertisement
    public function update($request)
    {
        $advertisement = Advertisement::find($request->id);
        if (! $advertisement) {
            return errorResponse(__('Advertisement not found.'));
        }
        try {
            if ($request->has('status') && count($request->all()) === 2) {
                if ($request->status === 'active') {
                    // Deactivate all other active advertisements
                    Advertisement::where('status', 1)
                    ->where('id', '!=', $request->id)
                    ->update(['status' => 0]);
                }

                // Update the current advertisement status
                $advertisement->update(['status' => $request->status === 'active' ? 1 : 0]);
            } else {
                // Update the full dataset
                $data = $this->makeData($request);
                if (isset($data['status']) && $data['status'] === 1) {
                    // Deactivate all other active advertisements
                    Advertisement::where('status', 1)->where('id', '!=', $request->id)->update(['status' => 0]);
                }
                $advertisement->update($data);
            }

            return successResponse(__('Advertisement updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Delete faq
    public function delete($request)
    {
        try {
            $advertisement = Advertisement::find($request->id);
            if (!$advertisement) {
                return errorResponse(__('Advertisement not found.'));
            }
            $advertisement->delete();
            return successResponse(__('Advertisement deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
