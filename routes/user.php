<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\PromptController;
use App\Http\Controllers\ProfileController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/feed/liked', [FeedController::class, 'liked'])
        ->name('feed.liked');

    Route::get('/feed/saved', [FeedController::class, 'saved'])
        ->name('feed.saved');

    Route::get('/prompts/create', [PromptController::class, 'create'])
        ->name('prompts.create');

    Route::post('/prompts', [PromptController::class, 'store'])
        ->name('prompts.store');

    Route::get('/prompts/{prompt}/edit', [PromptController::class, 'edit'])
        ->whereNumber('prompt')
        ->name('prompts.edit');

    Route::put('/prompts/{prompt}', [PromptController::class, 'update'])
        ->whereNumber('prompt')
        ->name('prompts.update');

    Route::delete('/prompts/{prompt}', [PromptController::class, 'destroy'])
        ->whereNumber('prompt')
        ->name('prompts.destroy');

    Route::post('/prompts/{prompt}/like', [PromptController::class, 'like'])
        ->whereNumber('prompt')
        ->middleware('throttle:20,1')
        ->name('prompts.like');

    Route::post('/prompts/{prompt}/save', [PromptController::class, 'save'])
        ->whereNumber('prompt')
        ->middleware('throttle:20,1')
        ->name('prompts.save');

    Route::get('/settings/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::put('/settings/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
});
