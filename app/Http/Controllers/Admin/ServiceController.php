<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceRequest;
use App\Http\Services\Admin\ServiceService;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    private $serviceService;

    public function __construct(ServiceService $serviceService)
    {
        $this->serviceService = $serviceService;
    }

    public function index(Request $request)
    {
        return $this->serviceService->index($request);
    }

    public function trainerIndex(Request $request)
    {
        return $this->serviceService->trainerIndex($request);
    }

    //service trainer details
    public function instructorDetails(Request $request)
    {
        return $this->serviceService->instructorDetails($request);
    }

    public function joinByUser(Request $request)
    {
        return $this->serviceService->joinByUser($request);
    }

    //per user list
    public function perUserList(Request $request){
        return $this->serviceService->perUserList($request);
    }

    public function userIndex(Request $request)
    {
        return $this->serviceService->userIndex($request);
    }

    public function show(Request $request)
    {
        return $this->serviceService->show($request);
    }

    public function adminShow(Request $request)
    {
        return $this->serviceService->adminShow($request);
    }

    //enroll service list
    public function enrollList(Request $request){
        return $this->serviceService->enrollList($request);
    }

    //delete Enroll service
    public function deleteEnroll(Request $request){
        return $this->serviceService->deleteEnroll($request);
    }

    public function store(ServiceRequest $request)
    {
         return $this->serviceService->store($request);
    }

    public function update(ServiceRequest $request)
    {
        return $this->serviceService->update($request);
    }

    public function delete(Request $request)
    {
        return $this->serviceService->delete($request);
    }

    public function interest(Request $request){
        return $this->serviceService->interest($request);
    }

    public function interestedUsers(Request $request){
        return $this->serviceService->interestedUsers($request);
    }


    public function noticeList(Request $request){
        return $this->serviceService->noticeList($request);
    }


}
