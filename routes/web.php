<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('welcome');  // This should render the Vite application
})->where('any', '.*');
