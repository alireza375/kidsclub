<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Services\Admin\LangService;
use Illuminate\Http\Request;

class LanguageController extends Controller
{
    private $languageService;


    public function __construct(LangService $languageService)
    {
        $this->languageService = $languageService;
    }

    public function index(Request $request)
    {
        return $this->languageService->index($request);
    }
    public function adminIndex(Request $request)
    {
        return $this->languageService->adminIndex($request);
    }

    public function show(Request $request)
    {
        return $this->languageService->show($request);
    }

    public function store(Request $request)
    {
        return $this->languageService->store($request);
    }

    public function update(Request $request)
    {
        return $this->languageService->update($request);
    }


    public function translations(Request $request)
    {
        return $this->languageService->translations($request);
    }

    public function delete(Request $request)
    {
        return $this->languageService->delete($request);
    }
}
