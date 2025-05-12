<?php

use App\Http\Controllers\Admin\BlogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Common\ChildrenController;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// coach routing section
Route::group(['middleware' => 'coach'], routes: function () {
    //blog list for trainer
    // Route::get('blog/trainers', [BlogController::class, 'trainerIndex']);
    Route::get('blog/trainers/details', [BlogController::class, 'show']);

    //children list for trainer
    Route::get('children/trainer/list', [ChildrenController::class, 'childrenIndex']);

    //trainer service list
    Route::get('service/trainer/list', [ServiceController::class, 'trainerIndex']);

    //trainer dashboard
    Route::get('dashboard/trainer', [DashboardController::class, 'trainerDashboard']);

});


