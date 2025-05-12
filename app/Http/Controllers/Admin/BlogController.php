<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BlogRequest;
use App\Http\Services\Admin\BlogService;
use Illuminate\Http\Request;

class BlogController extends Controller
{
    //
    private $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }


    // Blog List for admin
    public function index(Request $request)
    {
        return $this->blogService->index($request);
    }


    // Blog List for all
    public function blogIndex(Request $request)
    {
        return $this->blogService->blogIndex($request);
    }

    //trainer blog list
    // public function trainerIndex(Request $request)
    // {
    //     return $this->blogService->trainerIndex($request);
    // }


    // blog show by id
    public function show(Request $request)
    {
        return $this->blogService->show($request);
    }


    // Blog store
    public function store(BlogRequest $request)
    {
        return $this->blogService->store($request);
    }


    // Blog update
    public function update(Request $request)
    {
        return $this->blogService->update($request);
    }


    // Blog publish
    public function publish(Request $request){
        return $this->blogService->publish($request);
    }


    // Blog popular
    public function popular(Request $request){
        return $this->blogService->popular($request);
    }


    // Blog popular list
    public function popularList(Request $request){
        return $this->blogService->popularList( $request);
    }


    // Blog delete
    public function delete(Request $request)
    {
        return $this->blogService->delete($request);
    }

}
