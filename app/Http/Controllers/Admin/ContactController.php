<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ContactRequest;
use App\Http\Services\Admin\ContactService;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    //
    public $contactService;
    public function __construct(ContactService $contactService)
    {
        $this->contactService = $contactService;
    }


    // index contact list
    public function index(Request $request)
    {
        return $this->contactService->index($request);
    }


    // show contact details
    public function show(Request $request)
    {
        return $this->contactService->show($request);
    }


    // store contact
    public function store(ContactRequest $request)
    {
        return $this->contactService->store($request);
    }


    // delete contact
    public function delete(Request $request)
    {
        return $this->contactService->delete($request);
    }


    // contact reply
    public function reply(Request $request)
    {
        return $this->contactService->reply($request);
    }
}
