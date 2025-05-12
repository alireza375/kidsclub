<?php

namespace App\Http\Services\Common;

use App\Models\Setting;
use Exception;
use Illuminate\Support\Facades\Storage;

class FileUploadService
{
    public function storeSingle($request)
    {
        try {
            $path = Setting::get('upload_path')->value('upload_path');
            if ($request->hasFile('file')) {
                if ($path == "s3") {

                    $data = fileUploadAWS($request->file('file'), 'images');
                    if ($data['success']) {
                        return successResponse('File uploaded successfully.', $data['url']);
                    } else {
                        return errorResponse($data['message']);
                    }
                } else {
                    $url = fileUploadLocal($request->file('file'), "images");
                    if ($url['success']) {
                        return successResponse(__('File uploaded successfully.'), $url['url']);
                    } else {
                        return errorResponse($url['message']);
                    }
                }
            } else {
                return errorResponse(__('File not found.'));
            }
        } catch (\Exception $e) {
            return errorResponse($e->getMessage() . ' ' . $e->getLine());
        }
    }

    // Store Multiple Files
    public function storeMultiple($request)
    {
        try {
            // Fetch the value of the 'upload_path' setting
            $path = Setting::get('upload_path')->value('upload_path'); // Adjust column names as needed

            if (!$path) {
                return errorResponse(__('Upload path setting not found.'));
            }

            // Check if files exist in the request
            if ($request->hasFile('files')) {
                $files = $request->file('files');
                $uploadArray = [];

                foreach ($files as $file) {
                    if ($path == "s3") {

                        $res =  fileUploadAWS($file, "images");;
                        $uploadArray[] = $res['url'];
                    } else {
                        $res = fileUploadLocal($file, "images");
                        $uploadArray[] = $res['url'];
                    }
                }

                return successResponse(__('Files uploaded successfully.'), $uploadArray);
            } else {
                return errorResponse(__('Files not found.'));
            }
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    function removeFile($request)
    {
        try {
            // Parse the file URL
            $parsedUrl = parse_url($request->file);
    
            // Check if it's an S3 file or a local file
            if (isset($parsedUrl['host']) && str_contains($parsedUrl['host'], 's3')) {
                // S3 file
                $filePath = ltrim($parsedUrl['path'], '/'); // Extract file path
                if (Storage::disk('s3')->exists($filePath)) {
                    Storage::disk('s3')->delete($filePath);
                    return successResponse('S3 file deleted successfully!');
                } else {
                    return errorResponse('S3 file does not exist.');
                }
            } else {
                // Local file
                $filePath = ltrim($parsedUrl['path'], '/'); // Extract file path
                if (public_path($filePath)) {
                    unlink(public_path($filePath));
                    return successResponse('Local file deleted successfully!');
                } else {
                    return errorResponse('Local file does not exist.');
                }
            }
        } catch (Exception $e) {
            return errorResponse($e->getMessage());
        }
    }
}
