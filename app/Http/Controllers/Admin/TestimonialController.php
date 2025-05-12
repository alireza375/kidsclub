<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\TestimonialRequest;
use App\Http\Services\Admin\TestimonialService;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    //
    private $testimonialService;

    public function __construct(TestimonialService $testimonialService)
    {
        $this->testimonialService =  $testimonialService;
    }

    public function index(Request $request)
    {
        return $this->testimonialService->index($request);
    }

    public function userIndex(Request $request)
    {
        return $this->testimonialService->userIndex($request);
    }

    public function store(TestimonialRequest $request)
    {
        if(isset($request->id)){
            return $this->testimonialService->update($request);
        }
        return $this->testimonialService->store($request);
    }




    public function delete(Request $request)
    {
        return $this->testimonialService->delete($request);
    }


    public function changeStatus(Request $request)
    {
        return $this->testimonialService->changeStatus($request);
    }


}
