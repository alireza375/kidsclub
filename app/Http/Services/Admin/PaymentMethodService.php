<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\PaymentMethodResource;
use App\Http\Resources\Common\PaymentMethodResource as CommonPaymentMethodResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\PaymentMethod;
use Faker\Provider\ar_EG\Payment;

class PaymentMethodService
{
    public function makeData($request)
    {
        $data = [
            'name' => $request->get('name'),
            'type' => $request->get('type'),
            'config' =>$request->get('config'),
            'image' => $request->get('image'),
        ];

        return $data;
    }

    // All payment methods list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = PaymentMethod::query();
        $data->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%'.$request->search.'%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse('Method fetched successfully.', new BasePaginationResource(PaymentMethodResource::collection($data)));
    }
        // All payment methods list
        public function publicIndex($request)
        {
            $sort_by = $request->sort_by ?? 'id';
            $dir = $request->dir ?? 'desc';
            $per_page = $request->limit ?? PERPAGE_PAGINATION;
            // $data = PaymentMethod::where('isActive', 1);
            $data = PaymentMethod::query();
            $data->when(! empty(request('search')), function ($q) use ($request) {
                return $q->where(function ($q) use ($request) {
                    return $q->where('name', 'like', '%'.$request->search.'%');
                });
            });
            $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

            return successResponse('Method fetched successfully.', new BasePaginationResource(PaymentMethodResource::collection($data)));
        }

    public function paymentMethodList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = PaymentMethod::query();
        $data->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('email', 'like', '%'.$request->search.'%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse('Method fetched successfully.', new BasePaginationResource(CommonPaymentMethodResource::collection($data)));
    }

    public function userIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $data = PaymentMethod::query()->where('status', '!=', '0');
        $data->when(! empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('email', 'like', '%'.$request->search.'%');
            });
        });
        $data = $data->orderBy($sort_by, $dir)->paginate($per_page);
        // return $data;

        return successResponse('Method fetched successfully.', new BasePaginationResource(PaymentMethodResource::collection($data)));
    }

    // Get single payment method
    public function show($request)
    {
        $paymentMethod = PaymentMethod::find($request->_id);

        if (! $paymentMethod) {
            return errorResponse('Method not found.');
        }

        return successResponse('Method fetched successfully.', PaymentMethodResource::make($paymentMethod));
    }

    // Store payment method
    public function store($request)
    {
        $data = $this->makeData($request);
        $type = PaymentMethod::where('type', $request->type)->first();
        if ($type) {
            return errorResponse('Type already exists.');
        }
        try {
            PaymentMethod::create($data);

            return successResponse('Method created successfully.');
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Update payment method
    public function update($request)
    {
        $paymentMethod = PaymentMethod::find($request->id);

        if (! $paymentMethod) {
            return errorResponse(__('Method not found.'));
        }
        $type = PaymentMethod::where('type', $request->type)->where('id', '!=', $paymentMethod->id)->first();
        if ($type) {
            return errorResponse('Type already exists.');
        }
        $data = [];
        if (isset($request->config)) {
            $data['config'] = $request->config;
        }
        if (isset($request->image)) {
            $data['image'] = $request->image;
        }
        if (isset($request->name)) {
            $data['name'] = $request->name;
        }
        if (isset($request->type)) {
            $data['type'] = $request->type;
        }
        try {
            $paymentMethod->update($data);
            return successResponse(__('Method updated successfully.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Change payment method status
    public function changeStatus($request)
    {
        $paymentMethod = PaymentMethod::find($request->id);

        if (!$paymentMethod) {
            return errorResponse('Method not found.');
        }
        try {
            $paymentMethod->status = $request->status == 'true' ? 1 : 0;
            $paymentMethod->save();
            return successResponse('Method updated successfully.');
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Delete payment method
    public function delete($request)
    {
        try {
            $paymentMethod = PaymentMethod::find($request->id);
            if (! $paymentMethod) {
                return errorResponse('Method not found.');
            }
            $paymentMethod->delete();
            removeFile($paymentMethod->image);

            return successResponse('Method deleted successfully.');
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }
}
