<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductRequest;
use App\Http\Services\Admin\ProductService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    //
    private $productService;

    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }


    //service list show
    public function index(Request $request)
    {
        return $this->productService->index($request);
    }

    public function publicIndex(Request $request)
    {
        return $this->productService->publicIndex($request);
    }


    // product details show for Admin
    public function show(Request $request)
    {
        return $this->productService->show($request);
    }



    //product details show for User
    public function getproduct(Request $request)
    {
        return $this->productService->getproduct($request);
    }



    //add service
    public function store(ProductRequest $request)
    {
        return $this->productService->store($request);
    }


    //Update Product
    public function update(Request $request)
    {
        return $this->productService->update($request);
    }


    public function publishProduct(Request $request)
    {
        return $this->productService->publish($request);
    }




    //delete
    public function delete(Request $request)
    {
        return $this->productService->delete($request);
    }

}
