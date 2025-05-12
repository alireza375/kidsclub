<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PackageRequest;
use App\Http\Services\Admin\PackageService;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    private $pakageService;

    public function __construct(PackageService $pakageService)
    {
        $this->pakageService = $pakageService;
    }

    public function index(Request $request)
    {
        return $this->pakageService->index($request);
    }

    //admin index
    public function adminIndex(Request $request)
    {
        return $this->pakageService->adminIndex($request);
    }

    public function store(PackageRequest $request)
    {
        return $this->pakageService->store($request);
    }

    public function update(Request $request)
    {
        return $this->pakageService->update($request);
    }

    public function show(Request $request)
    {
        return $this->pakageService->show($request);
    }

    public function delete(Request $request)
    {
        return $this->pakageService->delete($request);
    }
}
