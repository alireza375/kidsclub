<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Common\GalleryResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Gallery;
use App\Models\Setting;
use Illuminate\Support\Facades\Storage;

class GalleryService
{
    public function makeData($request)
    {
        $data = [
            'image' => $request->hasFile('image') ? fileUploadLocalforImage($request->file('image'), IMAGE_PATH) :   null
        ];

        return $data;
    }

    // All gallery list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $query = Gallery::select(
            'id',
            'image',
            'created_at',
            'updated_at'
            )->orderBy($sort_by, $dir);
        $data = $query->paginate($per_page);

        return successResponse(__('Gallery fetched successfully.'), new BasePaginationResource($data));
    }



    public function publicIndex($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $query = Gallery::query();

        $query->when(!empty($request->search), function ($q) use ($request) {
            $q->where('title', 'like', '%' . $request->search . '%');
        });

        $query->orderBy($sort_by, $dir);
        $data = $query->paginate($per_page);

        return successResponse(__('Gallery fetched successfully.'), new BasePaginationResource(GalleryResource::collection($data)));
    }


    public function store($request)
    {
        $data = $this->makeData($request);
        try {
            $path = Setting::get('upload_path')->value('upload_path');

            if ($request->hasFile('file')) {
                $file = $request->file('file');

                if ($path === 's3') {
                    // Save file to S3
                    $filePath = 'images/' . uniqid() . '.' . $file->getClientOriginalExtension();
                    $uploaded = Storage::disk('s3')->put($filePath, file_get_contents($file), 'public');

                    if ($uploaded) {
                        $url = Storage::disk('s3')->url($filePath);
                        return successResponse('File uploaded successfully.', $url);
                    } else {
                        return errorResponse('Failed to upload file to S3.');
                    }
                } else {
                    // Save file locally
                    $url = fileUploadLocalforImage($file, "images");
                    if ($url['success']) {
                        return successResponse(__('File uploaded successfully.'), $url['url']);
                    } else {
                        return errorResponse($url['message']);
                    }
                }
            }

            $gallery = Gallery::create($data);
            return successResponse(__('Gallery created successfully.'), $gallery);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



    public function delete($request)
    {
        $gallery = Gallery::find($request->id);
        if (!$gallery) {
            return errorResponse(__('Gallery not found'));
        }
        try {
            $gallery->delete();
            removeFile($gallery->image);
            return successResponse(__('Gallery deleted successfully'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

}
