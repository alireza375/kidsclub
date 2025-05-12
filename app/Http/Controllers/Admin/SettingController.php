<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Services\Admin\SettingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    private $settingService;
    public function __construct(SettingService $settingService)
    {
        $this->settingService = $settingService;
    }

    public function postSettings(Request $request)
    {
        return $this->settingService->updateSettings($request);
    }

    public function getPublicSettings()
    {
        return $this->settingService->getPublicSettings();
    }

    public function getSettings()
    {
        return $this->settingService->getSettings();
    }

    public function getSiteSettings()
    {
        return $this->settingService->getSettings();
    }

    public function upload(Request $request)
    {
        return successResponse(__('Logo uploaded successfully.'), fileUploadAWS($request->file('logo'),  IMAGE_PATH));
    }

    public function deleteFile(Request $request){
        $data = Storage::disk('s3')->delete($request->file);
        return $data;
    }

    public function updateTheme(Request $request){
        return $this->settingService->updateTheme($request);
    }
}
