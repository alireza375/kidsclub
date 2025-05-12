<?php

namespace App\Http\Controllers\Common;

use App\Http\Controllers\Controller;
use App\Http\Requests\Common\UserRequest;
use App\Http\Services\Common\AuthService;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    private $authService;

    public function __construct(AuthService $authService,)
    {
        $this->authService = $authService;
    }
    public function registration(UserRequest $request)
    {
        return $this->authService->registration($request);
    }
    // Login User
    public function login(Request $request)
    {
        return $this->authService->login($request);
    }

    // Get Favicon
    public function getFavicon(Request $request)
    {
        return $this->authService->getFavicon($request);
    }

    //update user status by admin
    public function changeStatus(Request $request)
    {
        return $this->authService->changeStatus($request);
    }


    // Reset Password
    public function resetPassword(Request $request)
    {
        return $this->authService->resetPassword($request);
    }

    // Update Password
    public function updatePassword(Request $request)
    {
        return $this->authService->updatePassword($request);
    }


    public function createCoach(Request $request)
    {
        return $this->authService->createCoach($request);
    }


    //user list for admin
    public function userList(Request $request)
    {
        return $this->authService->userList($request);
    }

    // Coach list for User
    public function publicIndex(Request $request)
    {
        return $this->authService->TrainerList($request);
    }

    //coach list
    public function coachList(Request $request)
    {
        return $this->authService->coachList($request);
    }

    public function serviceCoachList(Request $request)
    {
        return $this->authService->TrainerList($request);
    }

    //user details
    public function show(Request $request)
    {
        return $this->authService->show($request);
    }

    //admin deleting user
    public function delete(Request $request)
    {
        return $this->authService->delete($request);
    }

}
