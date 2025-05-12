<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Services\Common\ProfileService;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    protected $profileService;
    public function __construct(ProfileService $profileService)
    {
        $this->profileService = $profileService;
    }
    // Get Profile
    public function getProfile()
    {
        return $this->profileService->getProfile();
    }
    // Update profile
    public function updateProfile(Request $request)
    {
        return $this->profileService->updateProfile($request);
    }

    // Find Profile 
    public function findProfile(Request $request)
    {
        return $this->profileService->findProfile($request);
    }
}
