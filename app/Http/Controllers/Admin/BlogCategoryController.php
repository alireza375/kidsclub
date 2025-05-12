<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogCategoryRequest;
use App\Http\Services\Admin\BlogCategoryService;
use Illuminate\Http\Request;

class BlogCategoryController extends Controller
{
    //
    private $categoryService;

    public function __construct(BlogCategoryService $categoryService)
    {
        $this->categoryService = $categoryService;
    }

    // index
    public function index(Request $request)
    {
        return $this->categoryService->index($request);
    }

    // show
    public function show(Request $request)
    {
        return $this->categoryService->show($request);
    }

    // store
    public function store(BlogCategoryRequest $request)
    {
        return $this->categoryService->store($request);
    }


    // update
    public function update(BlogCategoryRequest $request)
    {
        return $this->categoryService->update($request);
    }

    // delete
    public function delete(Request $request)
    {
        return $this->categoryService->delete($request);
    }
}
