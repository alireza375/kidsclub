<?php

namespace App\Http\Services\Admin;

use App\Models\Currency;
use App\Models\Setting;
use App\Models\settings;
use Illuminate\Support\Facades\Artisan;

class SettingService
{
    // // Store settings
    public function updateSettings($request)
    {
        try {
            $setting = Setting::first();
            $data = [
                'title' => $request->title,
                'description' => $request->description,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
                'currency' => $request->currency,
                'copyright' => $request->copyright,
                'instagram' => $request->instagram,
                'facebook' => $request->facebook,
                'twitter' => $request->twitter,
                'youtube' => $request->youtube,
                'whatsapp' => $request->whatsapp,
                'linkedin' => $request->linkedin,
                'upload_path' => $request->upload_path ?? "local"
            ];
    
            if ($setting->upload_path == "local") {
                // Logo upload
                if ($request->hasFile('logo')) {
                    $logoUpload = fileUploadLocal($request->file('logo'), "/images", $setting->logo ?? null);
                    if ($logoUpload['success']) {
                        $data['logo'] = $logoUpload['url'];
                    }
                } else {
                    $data['logo'] = $setting->logo ?? null;
                }
    
                // Favicon upload
                if ($request->hasFile('favicon')) {
                    $faviconUpload = fileUploadLocal($request->file('favicon'), "/images", $setting->favicon ?? null);
                    if ($faviconUpload['success']) {
                        $data['favicon'] = $faviconUpload['url'];
                    }
                } else {
                    $data['favicon'] = $setting->favicon ?? null;
                }
    
                // Breadcrumb upload
                if ($request->hasFile('breadcrumb')) {
                    $breadcrumbUpload = fileUploadLocal($request->file('breadcrumb'), "/images", $setting->breadcrumb ?? null);
                    if ($breadcrumbUpload['success']) {
                        $data['breadcrumb'] = $breadcrumbUpload['url'];
                    }
                } else {
                    $data['breadcrumb'] = $setting->breadcrumb ?? null;
                }
            } else {
                // Logo upload for AWS
                if ($request->hasFile('logo')) {
                    $logoUpload = fileUploadAWS($request->file('logo'), "/images", $setting->logo ?? null);
                    if ($logoUpload['success']) {
                        $data['logo'] = $logoUpload['url'];
                    }
                } else {
                    $data['logo'] = $setting->logo ?? null;
                }
    
                // Favicon upload for AWS
                if ($request->hasFile('favicon')) {
                    $faviconUpload = fileUploadAWS($request->file('favicon'), "/images", $setting->favicon ?? null);
                    if ($faviconUpload['success']) {
                        $data['favicon'] = $faviconUpload['url'];
                    }
                } else {
                    $data['favicon'] = $setting->favicon ?? null;
                }
    
                // Breadcrumb upload for AWS
                if ($request->hasFile('breadcrumb')) {
                    $breadcrumbUpload = fileUploadAWS($request->file('breadcrumb'), "/images", $setting->breadcrumb ?? null);
                    if ($breadcrumbUpload['success']) {
                        $data['breadcrumb'] = $breadcrumbUpload['url'];
                    }
                } else {
                    $data['breadcrumb'] = $setting->breadcrumb ?? null;
                }
                setEnvironmentValue(
            ['AWS_ACCESS_KEY_ID' => $request->aws_access_key_id  ?? env('AWS_ACCESS_KEY_ID'),
            'AWS_SECRET_ACCESS_KEY' => $request->aws_secret_access_key ?? env('AWS_SECRET_ACCESS_KEY'),
            'AWS_DEFAULT_REGION' => $request->aws_default_region ?? env('AWS_DEFAULT_REGION'),
            'AWS_BUCKET' => $request->aws_bucket ?? env('AWS_BUCKET'),
        ]);
            }
    
            if (!$setting) {
                Setting::create($data);
                Artisan::call('optimize:clear');
                return successResponse('Setting added successfully');
            } else {
                $setting->update($data);
                return successResponse('Setting updated successfully.');
            }
        } catch (\Exception $e) {
            return errorResponse($e->getMessage().' '.$e->getLine());
        }
    }
    

    // get Settings for admin
    public function getSettings()
    {
        $setting = Setting::first();
        $defaultCurrency = Currency::where('default', 1)->first();
        if ($defaultCurrency) {
            $symbol = $defaultCurrency->symbol;
        }
        if ($setting) {
            $data = [
                'id' => $setting->id,
                'title' => $setting->title,
                'description' => $setting->description,
                'logo' => $setting->logo,
                'favicon' => $setting->favicon, 
                'upload_path' => $setting->upload_path,
                'email' => $setting->email,
                'phone' => $setting->phone,
                'address' => $setting->address,
                'copyright' => $setting->copyright,
                'theme' => $setting->theme,
                'currency' => $symbol ?? '$',
                'instagram' => $setting->instagram,
                'facebook' => $setting->facebook,
                'linkedin' => $setting->linkedin,
                'twitter' => $setting->twitter,
                'youtube' => $setting->youtube,
                'whatsapp' => $setting->whatsapp,
                'breadcrumb' => $setting->breadcrumb
            ];
            if($setting->upload_path == "s3"){
                $data['aws_access_key_id'] = env('AWS_ACCESS_KEY_ID');
                $data['aws_secret_access_key'] = env('AWS_SECRET_ACCESS_KEY');
                $data['aws_default_region'] = env('AWS_DEFAULT_REGION');
                $data['aws_bucket'] = env('AWS_BUCKET');
            }
            return successResponse('Setting fetched successfully.', $data);
        } else {
            return errorResponse('setting not found.', null);
        }
    }


    //for public setting
    public function getPublicSettings()
    {
        $setting = Setting::first();
        if ($setting) {
            $data = [
                'id' => $setting->id,
                'title' => $setting->title,
                'description' => $setting->description,
                'logo' => $setting->logo,
                'email' => $setting->email,
                'phone' => $setting->phone,
                'address' => $setting->address,
                'copyright' => $setting->copyright,
                'theme' => $setting->theme,
                'currency' => $symbol ?? '$',
                'instagram' => $setting->instagram,
                'facebook' => $setting->facebook,
                'linkedin' => $setting->linkedin,
                'twitter' => $setting->twitter,
                'youtube' => $setting->youtube,
                'whatsapp' => $setting->whatsapp,
                'breadcrumb' => $setting->breadcrumb
            ];
            return successResponse('Setting fetched successfully.', $data);
        } else {
            return errorResponse('setting not found.', null);
        }
    }

    public function updateTheme($request)
    {
        $setting = Setting::first();
        $data = [
            'theme' => $request->theme,
        ];
        if ($setting) {
            $setting->update($data);
            return successResponse('Theme updated successfully.');
        } else {
            return errorResponse('setting not found.', null);
        }
    }
}
