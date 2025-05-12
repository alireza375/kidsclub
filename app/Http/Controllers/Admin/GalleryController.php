<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryRequest;
use App\Http\Services\Admin\GalleryService;
use Illuminate\Auth\Access\Gate;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    //
    private $galleryService;

    public function __construct(GalleryService $galleryService)
    {
        $this->galleryService = $galleryService;
    }

    public function index(Request $request)
    {
        return $this->galleryService->index($request);
    }

    public function publicIndex(Request $request)
    {
        return $this->galleryService->publicIndex($request);
    }

    public function storeGallery(GalleryRequest $request)
    {
        return $this->galleryService->store($request);
    }

    public function delete(Request $request)
    {
        return $this->galleryService->delete($request);
    }



}
