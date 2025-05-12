<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdvertisementRequest;
use App\Http\Services\Admin\AdvertisementService;
use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    private $advertisementService;

    public function __construct(AdvertisementService $advertisementService)
    {
        $this->advertisementService = $advertisementService;
    }

    public function index(Request $request)
    {
        return $this->advertisementService->index($request);
    }

    public function show(Request $request)
    {
        return $this->advertisementService->show($request);
    }

    //active advertisement
    public function activeAd(Request $request)
    {
        return $this->advertisementService->activeAd($request);
    }

    public function store(AdvertisementRequest $request)
    {
        return $this->advertisementService->store($request);
    }

    public function update(Request $request)
    {
        return $this->advertisementService->update($request);
    }

    public function delete(Request $request)
    {
        return $this->advertisementService->delete($request);
    }
}
