<?php

namespace App\Http\Services\Common;

use App\Http\Resources\Common\UserResource;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;


class ProfileService
{
    // Make data



    // Get Profile
    public function getProfile()
    {
        return successResponse(__('Profile fetched successfully.'), UserResource::make(Auth::guard('checkUser')->user()));
    }

    // Update profile
    public function updateProfile($request)
    {
        $user = Auth::guard('checkUser')->user();
        $user = User::where(['email' => $user->email])->first();

        if (! $user) {
            return errorResponse(__('User not found'));
        }

        // Check if phone number already exists
        $phnCheck = User::where(['phone' => $request->get('phone')])->where('id', '!=', $user->id)->exists();
        if ($phnCheck) {
            return errorResponse(__('Phone number already exists.'));
        }

        // Check if date_of_birth is not in the future
        $dateOfBirth = $request->get('dob');
        if ($dateOfBirth && Carbon::parse($dateOfBirth)->isFuture()) {
            return errorResponse(__('You cannot be born in the future.'));
        }



        $data = [
            'name' => $request->get('name') ?? $user->name,
            'phone' => $request->get('phone') ?? $user->phone,
            'email' => $request->get('email') ?? $user->email,
            'image' => $request->get('image') ?? $user->image,
            'facebook' => $request->get('facebook') ?? $user->facebook,
            'twitter' => $request->get('twitter') ?? $user->twitter,
            'linkedin' => $request->get('linkedin') ?? $user->linkedin,
            'instagram' => $request->get('instagram') ?? $user->instagram,
            'address' => json_encode($request->get('address'))  ?? $user->address,
            'about' => $request->get('about') ?? $user->about,
            'date_of_birth' => $request->get('dob') ?? $user->date_of_birth,
            'experience' => $request->get('experience') ?? $user->experience,
            'education' => $request->get('education') ?? $user->education,
            'description' => $request->get('description') ?? $user->description,
            'philosophy' => $request->get('philosophy') ?? $user->philosophy,
            'achievement' => $request->get('achievement') ?? $user->achievement,
            'skill' => $request->get('skill') ?? $user->skill,
        ];


        try {
            $user->update($data);

            return successResponse(__('Profile updated successfully.'), UserResource::make($user));
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }


    // Find Profile
    public function findProfile($request)
    {
        $user = User::where(['email' => $request->email])->first();
        if (empty($user)) {
            return errorResponse(__('User not found'));
        } else {
            return successResponse(__('Profile fetched successfully.'), ['account' => true, 'role' => $user->role == 1 ? 'user' : ($user->role == 2 ? 'trainer' : 'admin')]);
        }
    }
}
