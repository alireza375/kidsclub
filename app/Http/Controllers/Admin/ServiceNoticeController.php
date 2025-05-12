<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ServiceNoticeRequest;
use App\Http\Services\Admin\ServiceNoticeService;
use Illuminate\Http\Request;

class ServiceNoticeController extends Controller
{
    private $noticeService;

    public function __construct(ServiceNoticeService $noticeService)
    {
        $this->noticeService = $noticeService;
    }

    public function index(Request $request)
    {
        return $this->noticeService->index($request);
    }

    //admin index
    public function adminIndex(Request $request)
    {
        return $this->noticeService->adminIndex($request);
    }

    //enroll service notice list
    public function noticeList(Request $request)
    {
        return $this->noticeService->noticeList($request);
    }

    public function store(ServiceNoticeRequest $request)
    {
        return $this->noticeService->store($request);
    }

    public function update(Request $request)
    {
        return $this->noticeService->update($request);
    }

    public function show(Request $request)
    {
        return $this->noticeService->show($request);
    }

    public function delete(Request $request)
    {
        return $this->noticeService->delete($request);
    }
}
