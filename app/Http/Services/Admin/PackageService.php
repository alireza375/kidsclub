<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\PakageResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Package;
use GrahamCampbell\ResultType\Success;

class PackageService
{
    public function makeData($request)
    {
        $data = [
            'name' => json_encode($request->get('name')),
            'price' => $request->get('price'),
            'service_id' => json_encode($request->get('service_id')),
            'is_active' => $request->get('is_active') == 'true' ? 1 : 0,
            'image' => $request->get('image')
        ];
        return $data;
    }

    // All pakage list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Package::query()->where('is_active', 1);
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Pakage fetched successfully.'), new BasePaginationResource(PakageResource::collection($data)));
    }


    public function adminIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = Package::query();
        $data->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse(__('Pakage fetched successfully.'), new BasePaginationResource(PakageResource::collection($data)));
    }

    // Single pakage
    public function show($request)
    {
        $pakage = Package::find($request->id);
        if (!$pakage) {
            return errorResponse(__('Pakage not found.'));
        }
        return successResponse(__('Pakage fetched successfully.'), PakageResource::make($pakage));
    }

    // Store pakage
    public function store($request)
    {
        // Get the name from the request
        $requestedName = $request->name;
        $existingPackage = Package::where(function ($query) use ($requestedName) {
            foreach ($requestedName as $lang => $name) {
                $query->orWhereJsonContains('name->' . $lang, $name);
            }
        })->first();

        if ($existingPackage) {
            return errorResponse(__('This package name already exists. Try something new'));
        }
        $data = $this->makeData($request);
        try {
            Package::create($data);
            return successResponse(__('Package created successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // update pakage
    public function update($request)
    {
        // Find the package by ID
        $package = Package::find($request->id);

        if (!$package) {
            return response()->json(['message' => __('Package not found.')], 404);
        }

        try {
            // Prepare the data to update
            $data = [
                'name' => $request->get('name') ? json_encode($request->get('name')) : $package->name,
                'price' => $request->get('price') ?? $package->price,
                'service_id' => $request->get('service_id') ? json_encode($request->get('service_id')) : $package->service_id,
                'is_active' => $request->get('is_active') == 'true' ? 1 : 0 ?? $package->is_active,
                'image' => $request->get('image') ?? $package->image,
            ];

            // Update the package
            $package->update($data);

            return SuccessResponse(__('Package updated successfully.'));
        } catch (\Exception $e) {
            // Handle errors
            return errorResponse($e->getMessage());
        }
    }



    // Delete pakage
    public function delete($request)
    {
        try {
            $pakage = Package::find($request->id);
            if (!$pakage) {
                return errorResponse(__('Pakage not found.'));
            }
            $pakage->delete();
            return successResponse(__('Pakage deleted successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
