<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginPageController;
use App\Http\Controllers\Auth\GoogleAuthController;

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginPageController::class, 'show'])
        ->name('login');

    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])
        ->name('auth.google.redirect');

    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])
        ->name('auth.google.callback');
});

Route::post('/logout', [LoginPageController::class, 'destroy'])
    ->middleware('auth')
    ->name('logout');
