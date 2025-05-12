<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EventRequest;
use App\Http\Services\Admin\EventService;
use Illuminate\Http\Request;

class EventController extends Controller
{
    private $eventService;

    public function __construct(EventService $eventService)
    {
        $this->eventService = $eventService;
    }

    public function index(Request $request)
    {
        return $this->eventService->index($request);
    }
    public function publicEventList(Request $request)
    {
        return $this->eventService->publicIndex($request);
    }
    public function storeNotice(Request $request)
    {
        return $this->eventService->storeNotice($request);
    }

    public function deleteNotice(Request $request)
    {
        return $this->eventService->deleteNotice($request);
    }

    public function show(Request $request)
    {
        return $this->eventService->show($request);
    }

    public function store(EventRequest $request)
    {
         return $this->eventService->store($request);
    }

    public function update(EventRequest $request)
    {
        return $this->eventService->update($request);
    }
    public function changeStatus(Request $request)
    {
        return $this->eventService->changeStatus($request);
    }

    public function delete(Request $request)
    {
        return $this->eventService->delete($request);
    }

    public function interest(Request $request){
        return $this->eventService->interest($request);
    }

    public function interestedUsers(Request $request){
        return $this->eventService->interestedUsers($request);
    }
    public function ticketList(Request $request){
        return $this->eventService->ticketList($request);
    }
}

