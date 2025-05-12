<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $sort_by = $request->sort_by ?? 'id';
        $dir = $request->dir ?? 'desc';
        $per_page = $request->limit ?? PERPAGE_PAGINATION;
        $user = User::find(Auth::guard('checkUser')->user()->id);

        $notification = Notification::query()->where('user_id', $user->id)->orderBy($sort_by, $dir)->get();
        return successResponse(__('Notification fetched successfully.'), $notification);
    }

    public function read(Request $request)
    {
        $user = User::find(Auth::guard('checkUser')->user()->id);
        $notification = Notification::where([['user_id', $user->id], ['id', $request->id]])->first();
        if(!$notification) {
            return errorResponse(__('Notification not found.'));   
        }
        $notification->read = true;
        $notification->save();
        return successResponse(__('Notification read successfully.'));
    }

    // Delete notification
    public function delete(Request $request)
    {
        $user = User::find(Auth::guard('checkUser')->user()->id);
        $notification = Notification::where([['user_id', $user->id], ['id', $request->id]])->first();
        if(!$notification) {
            return errorResponse(__('Notification not found.'));   
        }
        $notification->delete();
        return successResponse(__('Notification deleted successfully.'));
    }
}
