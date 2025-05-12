<?php

namespace App\Http\Services\Admin;

use App\Http\Resources\Admin\ContactResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Contact;
use App\Models\Setting;
use Illuminate\Support\Facades\Mail;

class ContactService
{
    public function makeData($request)
    {
        $data = [
            'name' => $request->get('name'),
            'email' => $request->get('email'),
            'phone' => $request->get('phone'),
            'message' => $request->get('message')
        ];
        return $data;
    }


    // Get Contacts list
    public function index($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $query = Contact::query();
        $query->when(!empty(request('search')), function ($q) use ($request) {
            return $q->where(function ($q) use ($request) {
                return $q->where('name', 'like', '%' . $request->search . '%');
            });
        });
        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);
        return successResponse('Contacts fetched successfully.', new BasePaginationResource(ContactResource::collection($data)));
    }


    // Get single Contact details
    public function show($request)
    {
        $contact = Contact::where('id', $request->id)->first();
        if ($contact) {
            $data = [
                'id' => $contact->id,
                'name' => $contact->name,
                'email' => $contact->email,
                'phone' => $contact->phone,
                'message' => $contact->message,
                'subject' => $contact->subject,
                'status' => $contact->status == 1 ? true : false,
                'created_at' => $contact->created_at,
                'updated_at' => $contact->updated_at
            ];
            if ($contact->status == 1) {
                $data['reply'] = json_decode($contact->reply);
            }
            return successResponse('Contact fetched successfully.', $data);
        } else {
            return errorResponse('Contact not found.');
        }
    }


    // Create Contact
    public function store($request)
    {
        // Check if any record exists with the given email and status 0
        $checkEmail = Contact::where('email', $request->email)->where('status', 0)->exists();

        if ($checkEmail) {
            return errorResponse('You have already contacted us, and your request is pending. We will contact you soon.');
        }

        try {
            Contact::create($request->all());
            return successResponse(__('Thanks for contacting us. We will contact you soon.'));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



    // Delete Contact
    public function delete($request)
    {
        if ($request->id) {
            $data = Contact::where('id', $request->id)->delete();
            if (!$data) {
                return errorResponse(__('Contact not found.'));
            }
            return successResponse(__('Contact deleted successfully.'));
        } else {
            return errorResponse(__('Contact not found.'));
        }
    }


    // Contact Reply from admin to user
    public function reply($request)
    {
        // Validate input fields
        if (empty($request->message) || empty($request->email) || empty($request->subject)) {
            return errorResponse('Please fill all the fields.');
        }

        // Find the contact by ID
        $contact = Contact::find($request->id);
        if (!$contact) {
            return errorResponse('Contact not found.');
        }

        // Prepare data for saving in the database
        $data = [
            'email' => $request->get('email'),
            'message' => $request->get('message'),
            'subject' => $request->get('subject')
        ];

        // Save reply data in the contact
        $contact->reply = json_encode($data);
        $contact->status = 1;
        $contact->save();

        // Extract the required data for email
        $email = $data['email'];
        $userMessage = $data['message'];
        $subject = $data['subject'];

        try {
            // Get site settings for additional data (if required)
            $sideData = Setting::first();

            // Send email using the sendReply helper function
            sendReply($email, $sideData, $userMessage, $subject);

            return successResponse("Reply sent successfully.", $data);
        } catch (\Exception $e) {
            // Catch any errors and return the error response
            return errorResponse('Failed to send reply: ' . $e->getMessage());
        }
    }


}
