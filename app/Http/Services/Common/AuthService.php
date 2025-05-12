<?php

namespace App\Http\Services\Common;

use App\Http\Resources\Admin\CoachResource;
use App\Http\Resources\Common\UserResource;
use App\Http\Resources\Pagination\BasePaginationResource;
use App\Models\Notice;
use App\Models\Schedule;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Validation\Rule;
use App\Models\WishList;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthService
{
    public function registration($request)
    {
        $role = USER;
        if ($request->role == 'user' || $request->role == 'coach') {
            if ($request->role == 'user') {
                $role = USER;
            } else {
                $role = COACH;
            }
        } else {
            return errorResponse(__('Invalid role'));
        }
        $chekcEmail = User::where(['email' => $request->email])->exists();
        if ($chekcEmail) {
            return errorResponse(__('Email already exists'));
        }
        $checkPhone = User::where(['phone' => $request->phone])->exists();
        if ($checkPhone) {
            return errorResponse(__('Phone already exists'));
        }
        $checkOtp = otpVerify($request->email, $request->otp, 'registration');
        if ($checkOtp['status'] == false) {
            return errorResponse($checkOtp['message']);
        }
        $data = [
            'uuid' => Str::uuid(),
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'role' => $role,
            'status' => ACTIVE,
            'is_mail_verified' => ENABLE,
        ];

        try {
            $user = User::create($data);
            $token = $user->createToken($user->uuid.'user')->accessToken;

            return successResponse(__('Registration successfull'), ['token' => $token, 'role' => $request->role]);
        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }

    // Login
    public function login($request)
    {
        $user = User::where(['email' => $request->email])->first();
        if (empty($user)) {
            return errorResponse(__('User not found'));
        }
        if (! Hash::check($request->password, $user->password)) {
            return errorResponse(__('Password not matched'));
        }
        $token = $user->createToken($user->uuid.'user')->accessToken;

        return successResponse(__('Login successfull'), ['token' => $token, 'role' => $user->role == USER ? 'user' : ($user->role == COACH ? 'coach' : 'admin')]);
    }

    // get Favicon
    public function getFavicon($request)
    {
        $favicon = Setting::first();
        $favicon=$favicon->favicon;
        return successResponse(__('Favicon fetched successfully'), $favicon);
    }

    // Reset Password
    public function resetPassword($request)
    {

        $decoded = Crypt::decrypt($request->token);

        $user = User::where(['email' => $decoded])->first();
        if (empty($user)) {
            return errorResponse(__('User not found'));
        }
        $user->password = Hash::make($request->password);
        $user->save();

        return successResponse(__('Password reset successfully'));
    }

    // Update Password
    public function updatePassword($request)
    {
        $user = Auth::guard('checkUser')->user();
        if ($request->new_password) {
            $validator = Validator::make($request->all(), [
                'old_password' => 'required',
                'new_password' => 'required|min:6',
            ]);
            if ($validator->fails()) {
                return errorResponse($validator->errors()->first());
            }
        }
        $user = User::where(['email' => $user->email])->first();
        if (! Hash::check($request->old_password, $user->password)) {
            return errorResponse(__('Old password not matched'));
        }
        $user->password = Hash::make($request->new_password);
        $user->save();

        return successResponse(__('Password updated successfully'));
    }

    //update user status
    public function changeStatus($request)
    {
        // return $request->all();
        $user = User::find($request->id);
        if (! $user) {
            return errorResponse(__('User not found.'));
        }
        $user->status = $request->status == "true" ? ACTIVE : INACTIVE;
        $user->save();
        return successResponse(__('User status updated successfully'));
    }


    // create coach
    public function createCoach($request)
    {
        // Validate the request data
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->whereNull('deleted_at'),
            ],
            'password' => 'required',
            'phone' => [
                'required',
                Rule::unique('users')->whereNull('deleted_at'),
            ],
        ]);

        if ($validator->fails()) {
            return errorResponse($validator->errors()->first());
        }

        // Check if the email exists in soft-deleted records
        $existingSoftDeletedUser = User::onlyTrashed()->where('email', $request->email)->first();

        // If a soft-deleted user exists, restore and update
        if ($existingSoftDeletedUser) {
            try {
                // Restore the soft-deleted user
                $existingSoftDeletedUser->restore();

                // Update user credentials
                $existingSoftDeletedUser->update([
                    'name' => $request->name,
                    'password' => Hash::make($request->password),
                    'phone' => $request->phone,
                    'role' => COACH,
                    'status' => ACTIVE,
                    'is_mail_verified' => ENABLE,
                ]);

                // Generate a new token for the restored user
                $token = $existingSoftDeletedUser->createToken($existingSoftDeletedUser->uuid . 'trainer')->accessToken;

                return successResponse(__('Trainer account created successfully'), ['token' => $token]);

            } catch (\Exception $e) {
                return errorResponse($e->getMessage());
            }
        }

        // If no soft-deleted user exists, check for duplicates in active records
        $existingActiveUser = User::where('email', $request->email)->whereNull('deleted_at')->first();
        if ($existingActiveUser) {
            return errorResponse(__('This email is already in use by an active account.'));
        }

        // Check if phone number is already used by an active user
        $existingPhoneUser = User::where('phone', $request->phone)->whereNull('deleted_at')->first();
        if ($existingPhoneUser) {
            return errorResponse(__('This phone number is already in use by an active account.'));
        }

        // If no active or soft-deleted user exists, create a new user
        try {
            $data = [
                'uuid' => Str::uuid(),
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'role' => COACH,
                'status' => ACTIVE,
                'is_mail_verified' => ENABLE,
            ];

            // Create the new user
            $trainer = User::create($data);

            // Generate a new token for the created user
            $token = $trainer->createToken($trainer->uuid . 'trainer')->accessToken;

            return successResponse(__('Trainer account created successfully'), ['token' => $token]);

        } catch (\Exception $e) {
            return errorResponse($e->getMessage());
        }
    }



    // trainer List for admin
    public function coachList($request)
{
    // Initialize the query for trainers
    $query = User::where('role', COACH); // Use constant for maintainability

    // Add search functionality if provided
    if (!empty($request->search)) {
        $search = $request->search;

        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }

    // Determine pagination limit with validation fallback
    $perPage = (int) ($request->limit ?? PERPAGE_PAGINATION);
    $perPage = $perPage > 0 ? $perPage : PERPAGE_PAGINATION; // Ensure positive limit

    // Get paginated data ordered by creation date
    $data = $query->orderBy('created_at', 'desc')->paginate($perPage);

    // Return a success response with the paginated data
    return successResponse(
        __('Trainer list'),
        new BasePaginationResource(CoachResource::collection($data))
    );
}


    //user list
    public function userList($request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $lang = $request->langCode ?? 'en';

        $query = User::query();

        // Exclude records where role is 'admin'
        $query->where('role', USER);

        // Filter by subscription status if specified
        if ($request->filled('subscription')) {
            if ($request->subscription === 'active') {
                $query->whereHas('userSubscription', function ($q) {
                    $q->where('active', 1)->where('is_paid', 1);
                });
            } elseif ($request->subscription === 'inactive') {
                $query->whereDoesntHave('userSubscription', function ($q) {
                    $q->where('active', 1)->where('is_paid', 1);
                });
            }
        }

        // Define fields to search
        $searchableFields = ['name', 'email', 'phone', 'role'];

        // Apply search filter
        if ($request->filled('search')) {
            $searchTerm = '%'.$request->search.'%';

            $query->where(function ($q) use ($searchTerm, $searchableFields) {
                foreach ($searchableFields as $field) {
                    $q->orWhere($field, 'like', $searchTerm);
                }
            });
        }

        $data = $query->orderBy($sort_by, $dir)->paginate($per_page);

        return successResponse(__('Successfully retrieved user list'), new BasePaginationResource(UserResource::collection($data)));
    }

    //for group trainer
    public function groupTrainerList($request)
    {
        // Initialize the query for trainers
        $query = User::where('role', COACH);

        // Add search functionality if provided
        if ($request->has('search') && ! empty($request->search)) {
            $query->where('name', 'like', '%'.$request->search.'%');
        }

        $per_page = $request->limit ?? PERPAGE_PAGINATION;

        $trainers = $query->orderBy('created_at', 'desc')->paginate($per_page);

        // Prepare the data
        $data = $trainers->map(function ($trainer) {
            return [
                'id' => $trainer->id,
                'name' => $trainer->name,
                'phone' => $trainer->phone,
                'email' => $trainer->email,
                'role' => $trainer->role == COACH ? 'coach' : 'admin',
                'created_at' => $trainer->created_at,
                'updated_at' => $trainer->updated_at,
                'skills' => $trainer->skills ?? [],
                'gender' => $trainer->gender ?? null,
                'image' => $trainer->image ?? null,
            ];
        });

        return successResponse(__('Coach list'), $data);
    }


    // Service Coach List
    public function TrainerList($request)
    {
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $trainers = User::where('role', COACH)->orderBy('created_at', 'desc')->paginate($per_page);
        return successResponse(__('Coach list'), new BasePaginationResource(CoachResource::collection($trainers)));
    }

    //user details
    public function show($request)
    {
        $user = User::find($request->id);
        if (! $user) {
            return errorResponse(__('User not found.'));
        }

        return successResponse(__('User details fetched successfully'), UserResource::make($user));
    }

    //admin deleting user (soft delete)
    public function delete($request)
    {
        $user = User::find($request->id);
        if (! $user) {
            return errorResponse(__('Not found.'));
        }

        // Soft delete the user
        $user->delete();

        // Optionally, remove the user's image
        removeFile($user->image);

        return successResponse(__('Deleted successfully'));
    }



    //restore user
    public function restore($request)
    {
        $user = User::onlyTrashed()->find($request->id);  // Get only soft-deleted users
        if (! $user) {
            return errorResponse(__('Not found.'));
        }

        // Restore the soft-deleted user
        $user->restore();

        return successResponse(__('Restored successfully'));
    }


}
