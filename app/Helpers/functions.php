<?php

use App\Events\NotifyUser;
use App\Mail\ReplyMail;
use App\Models\Notification;
use Illuminate\Support\Str;
use App\Models\Otp;
use App\Models\Setting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Twilio\Rest\Client;
// use App\Mail\ReplyMail;



function setEnvironmentValue(array $values)
{
    $envFile = app()->environmentFilePath();
    $str = file_get_contents($envFile);
    $str .= "\r\n";

    if (count($values) > 0) {
        foreach ($values as $envKey => $envValue) {
            $keyPosition = strpos($str, "$envKey=");
            $endOfLinePosition = strpos($str, "\n", $keyPosition);
            $oldLine = substr($str, $keyPosition, $endOfLinePosition - $keyPosition);

            if (is_bool($keyPosition) && $keyPosition === false) {
                // variable doesnot exist
                $str .= "$envKey=$envValue";
                $str .= "\r\n";
            } else {
                // variable exist
                $str = str_replace($oldLine, "$envKey=$envValue", $str);
            }
        }
    }
    $str = substr($str, 0, -1);
    if (!file_put_contents($envFile, $str)) {
        return false;
    }
    app()->loadEnvironmentFrom($envFile);
    Artisan::call('optimize:clear');
    return true;
}

// all file upload
function fileUpload($file, $path, $old_file = null)
{
    $setting = Setting::first();
    if($setting->upload_path == 's3'){
        return fileUploadAWS($file, $path, $old_file);
    }else{
        return fileUploadLocal($file, $path, $old_file);
    }
}


function errorResponse($message = null, $status = 400, $data = null,)
{
    $message = $message ? $message :  'Something went wrong';
    $response  = ['success' => false, 'status' => $status, 'message' => $message, 'data' =>  $data];
    return response()->json($response, $status);
}

function successResponse($message = null, $data = null, $status = 200)
{
    $message = $message ? $message :  'success';
    $response  = ['success' => true, 'status' => $status, 'message' => $message, 'data' =>  $data];
    return response()->json($response, $status);
}

function otpVerify($email = null, $otp = null, $type = null)
{

    $message = 'Done';
    $status = true;
    // $otp = Otp::where(['otp' => $request->otp, 'phone' => str_replace(' ', '', $request->phone)])->first();
    $otp = Otp::where(['otp' => str_replace(' ', '', $otp), 'email' => $email])->first();

    if (empty($otp)) {
        return [
            'message' => __("OTP is not valid"),
            'status' => false
        ];
    }
    if (!$otp->type === $type) {
        return [
            'message' => __("OTP is not valid"),
            'status' => false
        ];
    }

    if (Carbon::now() > Carbon::parse($otp->expired_at)) {
        return [
            'message' => __("OTP has been expired"),
            'status' => false
        ];
    }
    if ($status == true) {
        $otp->delete();
    }

    return [
        'message' => $message,
        'status' => $status
    ];
}

/**
 * array response
 */

function errorReturn($message = null, $status = 400, $data = null,)
{
    $message = $message ? $message :  __('wrong_message');
    return  ['success' => false, 'status' => $status, 'message' => $message, 'data' =>  $data];
}

function successReturn($message = null, $data = [], $status = 200)
{
    $message = $message ? $message :  __('success_message');
    return ['success' => true, 'status' => $status, 'message' => $message, 'data' =>  $data];
}



// Send Mail
function sendOtp($email,$sitedata, $otp){
    $data = array('name'=>$sitedata->title, 'email' => $sitedata->email,'phone' => $sitedata->phone,'otp' => $otp);
    Mail::send('emails.sendOtp', $data, function($message) use ($email) {
       $message->to($email, env('APP_NAME'))->subject
          ('Verification OTP');
       $message->from($email, env('APP_NAME'));
    });
 }


 //send reply
 function sendReply($email, $sideData, $userMessage, $subject)
 {
     // Prepare data to be passed to the email view
     $data = array(
        'siteLogo' => $sideData->logo ?? '',
        'siteName' => $sideData->title ?? 'Kidstick',
        'userMessage' => $userMessage,
        'subject' => $subject
    );


     try {
         Mail::send('emails.reply', $data, function ($message) use ($email, $sideData, $subject) {
             $siteEmail = $sideData->email ?? env('MAIL_FROM_ADDRESS');
             $siteName = $sideData->title ?? env('MAIL_FROM_NAME');

             $message->to($email, $siteName)->subject($subject);
             $message->from($siteEmail, $siteName);
         });
     } catch (\Exception $e) {
         return errorResponse('Failed to send reply email: ' . $e->getMessage());
     }
 }



/**
 * File upload
 */
function fileUploadAWS($file, $path, $old_file = null)
{
    try {
        // Upload file to S3 and get the URL
        $uploadedPath = Storage::disk('s3')->put($path, $file, 'public');
        $url = Storage::disk('s3')->url($uploadedPath);

        // Delete old file if provided
        if ($old_file != null) {
            $parsedUrl = parse_url($old_file);
            $filePath = ltrim($parsedUrl['path'], '/'); // Extract file path
            if (Storage::disk('s3')->exists($filePath)) {
                Storage::disk('s3')->delete($filePath);
                return successResponse('S3 file deleted successfully!');
            }
        }

        return [
            'success' => true,
            'url' => $url
        ];
    } catch (Exception $e) {
        // Return error response with message
        return [
            'success' => false,
            'message' => $e->getMessage()
        ];
    }
}



function fileRemoveAWS($path){
    if(Storage::disk('s3')->delete($path)){
        return true;
    }else{
        return false;
    }
}

function fileUploadLocal($file, $path = "/images", $old_file = null)
{
    try {
        // Ensure the directory exists, create if not
        if (!file_exists(public_path($path))) {
            mkdir(public_path($path), 0777, true);
        }

        // Generate a unique file name
        $file_name = time() . '_' . randomNumber(16) . '_' . $file->getClientOriginalName();
        $file_name = str_replace(' ', '_', $file_name); // Replace spaces with underscores

        // Define the full destination path
        $destinationPath = public_path($path);

        // Delete old file if specified
        if ($old_file) {
            removeFileLocal($path, $old_file);
        }

        // Upload the file
        $file->move($destinationPath, $file_name);

        // Return the full path of the uploaded file
       return [
           'success' => true,
           'url' => url($path . "/" . $file_name)
       ];
    } catch (Exception $e) {
        // Handle any exceptions and return null
        return [
            'success' => false,
            'message' => $e->getMessage()." ".$e->getLine()
        ];
    }
}

function fileUploadLocalforImage($file, $path = "images", $old_file = null)
{
    try {
        // Ensure the directory exists, create if not
        if (!file_exists(public_path($path))) {
            mkdir(public_path($path), 0777, true);
        }

        // Generate a unique file name
        $file_name = time() . '_' . randomNumber(16) . '_' . $file->getClientOriginalName();
        $file_name = str_replace(' ', '_', $file_name); // Replace spaces with underscores

        // Define the full destination path
        $destinationPath = public_path($path);

        // Delete old file if specified
        if ($old_file) {
            removeFileLocal($path, $old_file);
        }

        // Upload the file
        $file->move($destinationPath, $file_name);

        // Return the full path of the uploaded file

        //    'success' => true,
        // return successResponse(_('Uploaded successfully'), url($path . "/" . $file_name));

        // return [
        //     'success' => true,
        //     'url' => url($path . "/" . $file_name)
        // ]
        return url($path . "" . $file_name);

    } catch (Exception $e) {
        // Handle any exceptions and return null
        return errorResponse($e->getMessage()." ".$e->getLine());
    }
}



function removeFileLocal($path, $old_file)
{
    $url =  public_path($path);
    $old_file_name = str_replace($url . '/', '', $old_file);

    if (isset($old_file) && $old_file != "" && file_exists($path . $old_file_name)) {
        unlink($path . $old_file_name);
    }
    return true;

}


function removeFile($file)
{
    try {
        // Parse the file URL
        $parsedUrl = parse_url($file);

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


/**
 * Random number
 */
function randomNumber($a = 10)
{
    $x = '0123456789';
    $c = strlen($x) - 1;

    $z = rand(1, $c);       # first number never taken 0

    for ($i = 0; $i < $a - 1; $i++) {
        $y = rand(0, $c);
        $z .= substr($x, $y, 1);
    }

    return $z;
}

/**
 * unique slug for products
 */
function slug($mode, $name, $id = null)
{
    $slugInc = null;
    $productData['slug'] = Str::slug($name);

    do {
        $productData['slug'] = $slugInc ? Str::slug($name . '_' . $slugInc) : Str::slug($name);
        if ($id) {
            $existSlug = $mode::where('slug', $productData['slug'])->where('id', '!=', $id)->exists();
        } else {
            $existSlug = $mode::where('slug', $productData['slug'])->exists();
        }
        if ($slugInc >= 1) {
            $slugInc++;
        } else {
            $slugInc = 1;
        }
    } while ($existSlug);

    return  $productData['slug'];
}

// Send mail
function sendMailToUser( $to ,$message,$subject = null)
{
    if (is_array($to)) {
        $success = true;
        foreach ($to as $key => $value) {
            if(!$subject){
                $subject = "Send From" . env('APP_NAME');
            }
            $data = array('name' => "Homestick", 'email' => $value,'subject' => $subject, 'text' => $message);
            try {
                Mail::send('marketing::Emails.mail', $data, function ($message) use ($value, $subject) {
                    $message->to($value, env('APP_NAME'))->subject($subject);
                    $message->from('support@'.env('APP_NAME').'.com', env('APP_NAME'));
                });
                $success = true;
            } catch (Exception $exception) {
                $success = $exception->getMessage();
            }
        }
        return $success;

    }elseif (is_string($to)) {
        if(!$subject){
            $subject = "Send From" . env('APP_NAME');
        }

        $data = array('name' => "Homestick", 'email' => $to,'subject' => $subject, 'text' => $message);
        try {
            Mail::send('marketing::Emails.mail', $data, function ($message) use ($to, $subject) {
                $message->to($to, env('APP_NAME'))->subject($subject);
                $message->from('support@'.env('APP_NAME').'.com', env('APP_NAME'));
            });
            return true;
        } catch (Exception $exception) {
            return $exception->getMessage();
        }
    }
}



// Send notification

function SendNotification($user_id, $title, $type, $image)
{

    try {
        // create notification
        $notification = Notification::create([
            'user_id' => $user_id,
            'title' => $title,
            'type' => $type,
            'image' => $image,
        ]);
        $id = $notification->id;
        $message = $notification->title;
        $user_id = $notification->user_id;
        $type = $notification->type;
        $image = $notification->image;
        $date = $notification->created_at;

        // Trigger the event
        broadcast(new NotifyUser($id, $message, $user_id, $type, $image, $date));

        return true;
    } catch (Exception $exception) {
        // return ["status" => false, "message" => $exception->getMessage()];
        return $exception->getMessage() ;
    }

}
