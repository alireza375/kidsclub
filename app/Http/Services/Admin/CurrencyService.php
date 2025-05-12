<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\CurrencyResource;
use App\Models\Currency;

class CurrencyService
{
    // All currency list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit;
        $query = Currency::query();
        $query->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%'.$request->search.'%');
            });
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);
        $data = CurrencyResource::collection($data);

        return successResponse(__('Data fetched successfully.'), $data);
    }

    // Single currency
    public function show($request)
    {
        $data = Currency::find($request->id);
        if (!$data) {
            return errorResponse(__('Data not found.'));
        }
        $data = new CurrencyResource($data);
        return successResponse(__('Data fetched successfully.'), $data);
    }

    // Store currency
    public function store($request)
    {
        $data = $request->all();

        // Check if the code already exists
        $check = Currency::where('code', $data['code'])->first();
        if ($check) {
            return errorResponse(__('Code already exists.'));
        }

        // Handle rate (if provided)
        if (! isset($data['rate'])) {
            return errorResponse(__('Rate is required.'));
        }

        // Handle default currency setting
        if (isset($data['default']) && $data['default'] == 1) {
            $default = Currency::where('default', 1)->first();
            if ($default) {
                $default->default = 0;
                $default->save();
            }
        }

        // Create the new currency record
        $currency = Currency::create($data);

        return successResponse(__('Data created successfully.'), $currency);
    }

    // Update currency
    public function update($request)
    {
        $data = $request->all();
        if (isset($data['default']) && $data['default'] == 1) {

            $default = Currency::where('default', 1)->first();
            if ($default) {
                $default->default = 0;
                $default->save();
            }
        }
        $data = Currency::find($request->id)->update($data);

        return successResponse(__('Data updated successfully.'));
    }

    // Delete currency
    public function delete($request)
    {
        $data = Currency::find($request->id);
        if (isset($data['default']) && $data['default'] == 1) {
            return errorResponse(__('Default currency can not be deleted.'));
        }
        if (! $data) {
            return errorResponse(__('Data not found.'));
        }
        $data->delete();

        return successResponse(__('Data deleted successfully.'));
    }
}
