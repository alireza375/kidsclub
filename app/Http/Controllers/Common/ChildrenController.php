<?php

namespace App\Http\Controllers\Common;  // Corrected the namespace to 'Common'

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\ChildrenRequest;
use App\Http\Services\Common\ChildrenService;
use Illuminate\Http\Request;

class ChildrenController extends Controller
{
    private $childrenService;

    public function __construct(ChildrenService $childrenService)
    {
        $this->childrenService = $childrenService;
    }

    //admin children list
    public function adminIndex(Request $request)
    {
        return $this->childrenService->adminIndex($request);
    }

    //trainer children list
    public function childrenIndex(Request $request)
    {
        return $this->childrenService->childrenIndex($request);
    }

    //per user children list
    public function index(Request $request)
    {
        return $this->childrenService->index($request);
    }

    public function show(Request $request)
    {
        return $this->childrenService->show($request);
    }

    public function storeChildren(ChildrenRequest $request)
    {
        return $this->childrenService->store($request);
    }

    public function updateChildren(Request $request)
    {
        return $this->childrenService->update($request);
    }

    public function delete(Request $request)
    {
        return $this->childrenService->delete($request);
    }
}
