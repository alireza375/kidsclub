<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->appendToGroup('checkUser', [
            \App\Http\Middleware\CheckUserMiddleware::class
        ]);
        $middleware->appendToGroup('admin', [
            \App\Http\Middleware\AdminMiddleware::class
        ]);
        $middleware->appendToGroup('AdminOrCoach', [
            \App\Http\Middleware\AdminOrCoachMiddleware::class
        ]);
        $middleware->appendToGroup('coach',  [
            \App\Http\Middleware\CoachMiddleware::class
        ]);
        $middleware->appendToGroup('user', [
            \App\Http\Middleware\UserMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
