<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Services\Common\FileUploadService;
use Illuminate\Http\Request;

class FileUploadController extends Controller
{
    private $fileUploadService;
    public function __construct(FileUploadService $fileUploadService)
    {
        $this->fileUploadService = $fileUploadService;
    }
    public function uploadSingle(Request $request)
    {
        return $this->fileUploadService->storeSingle($request);
    }

    public function uploadMultiple(Request $request)
    {
        return $this->fileUploadService->storeMultiple($request);
    }

    public function removeFile(Request $request)
    {
        return $this->fileUploadService->removeFile($request);
    }

}
