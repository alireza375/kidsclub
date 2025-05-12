<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\NewsletterRequest;
use App\Http\Services\Admin\NewsletterService;
use App\Models\Newsletter;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    //
    private $newsletterService;

    public function __construct(NewsletterService $newsletterService)
    {
        $this->newsletterService = $newsletterService;
    }

    public function index(Request $request)
    {
        return $this->newsletterService->index($request);
    }

    public function subscribe(NewsletterRequest $request)
    {
        return $this->newsletterService->subscribe($request);
    }

    public function delete(Request $request)
    {
        return $this->newsletterService->delete($request);
    }
}
