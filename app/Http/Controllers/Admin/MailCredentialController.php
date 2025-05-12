<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MailCredential;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class MailCredentialController extends Controller
{
    //show Mail Credential
    public function show()
    {
        $data = MailCredential::first();
        if (! $data) {
            return successResponse('Mail credential not found.');
        }
        $demo = false;
        // check demo mode
        if (env('DEMO_MODE') == 'on') {
            $demo = true;
        }
        $mailData = [
            'id' => $data->id,
            'default' => $data->default,
            'sendgrid' => $demo ? ['username' => '*******', 'password' => '*******', 'host' => 'smtp.sendgrid.net', 'port' => 587, 'sender_email' => '*******', 'service_provider' => 'Sendgrid'] : json_decode($data->sendgrid),
            'gmail' => $demo ? [
                'auth_email' => '*******',
                'password' => '*******',
                'service_provider' => 'Gmail',
            ] : json_decode($data->gmail),
            'other' => $demo ? ['host' => '*******', 'port' => '*******', 'address' => '*******', 'password' => '*******', 'provider_name' => 'others'] : json_decode($data->other),
        ];

        return successResponse('Mail credential fetched successfully', $mailData);
    }

    // Store and update Mail Credential
    public function storeUpdate(Request $request)
    {
        $data = [
            'default' => $request->default,
            'sendgrid' => $request->sendgrid !== null ? json_encode($request->sendgrid) : null,
            'gmail' => $request->gmail !== null ? json_encode($request->gmail) : null,
            'other' => $request->other !== null ? json_encode($request->other) : null,
        ];
        // Set the environment variables based on the selected mail provider
        if ($request->default == 'gmail') {
            setEnvironmentValue([
                'MAIL_USERNAME' => $request->gmail['auth_email'] !== null ? str_replace(' ', '', $request->gmail['auth_email']) : '',
                'MAIL_PASSWORD' => $request->gmail['password'] !== null ? str_replace(' ', '', $request->gmail['password']) : '',
                'MAIL_FROM_ADDRESS' => $request->gmail['auth_email'] !== null ? str_replace(' ', '', $request->gmail['auth_email']) : '',
                'MAIL_PORT' => 587,
                'MAIL_HOST' => 'smtp.gmail.com',
                'MAIL_MAILER' => 'smtp',
            ]);
        } elseif ($request->default == 'sendgrid') {
            setEnvironmentValue([
                'MAIL_USERNAME' => $request->sendgrid['username'] !== null ? str_replace(' ', '', $request->sendgrid['username']) : '',
                'MAIL_PASSWORD' => $request->sendgrid['password'] !== null ? str_replace(' ', '', $request->sendgrid['password']) : '',
                'MAIL_FROM_ADDRESS' => $request->sendgrid['sender_email'] !== null ? str_replace(' ', '', $request->sendgrid['sender_email']) : '',
                'MAIL_PORT' => 587,
                'MAIL_HOST' => 'smtp.sendgrid.net',
                'MAIL_MAILER' => 'smtp',
            ]);
        } else {
            setEnvironmentValue([
                'MAIL_USERNAME' => $request->other['address'] !== null ? str_replace(' ', '', $request->other['address']) : '',
                'MAIL_PASSWORD' => $request->other['password'] !== null ? str_replace(' ', '', $request->other['password']) : '',
                'MAIL_FROM_ADDRESS' => $request->other['address'] !== null ? str_replace(' ', '', $request->other['address']) : '',
                'MAIL_PORT' => $request->other['port'] !== null ? str_replace(' ', '', $request->other['port']) : '',
                'MAIL_HOST' => $request->other['host'] !== null ? str_replace(' ', '', $request->other['host']) : '',
                'MAIL_MAILER' => $request->other['provider_name'] !== null ? str_replace(' ', '', $request->other['provider_name']) : '',
            ]);
        }



        // Check if a record with the given 'default' already exists
        $existingRecord = MailCredential::where('id', $request->id)->first();

        if ($existingRecord) {
            // Record exists, update it
            $existingRecord->update($data);
            // Clear cached configurations
            Artisan::call('cache:clear');
            Artisan::call('view:clear');
            Artisan::call('route:clear');
            Artisan::call('optimize:clear');
            return successResponse('Mail credential updated successfully.', $existingRecord);
        } else {
            // Record doesn't exist, create a new one
            $newRecord = MailCredential::create($data);
            // Clear cached configurations
            Artisan::call('cache:clear');
            Artisan::call('view:clear');
            Artisan::call('route:clear');
            Artisan::call('optimize:clear');

            return successResponse('Mail credential created successfully.', $newRecord);
        }
    }
}
