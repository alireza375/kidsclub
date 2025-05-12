<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductCategoryRequest;
use App\Http\Services\Admin\ProductCategoryService;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    //
    private $productCategoryService;

    public function __construct(ProductCategoryService $productCategoryService) {
        $this->productCategoryService = $productCategoryService;
    }

    public function index(Request $request) {
        return $this->productCategoryService->index($request);
    }


    public function show(Request $request) {
        return $this->productCategoryService->show($request);
    }

    public function store(ProductCategoryRequest $request) {
        return $this->productCategoryService->store($request);
    }

    public function update(Request $request) {
        return $this->productCategoryService->update($request);
    }

    public function delete(Request $request) {
        return $this->productCategoryService->delete($request);
    }


}
