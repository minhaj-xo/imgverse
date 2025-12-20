<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\PromptController;
use App\Http\Controllers\ProfileController;

Route::get('/', [FeedController::class, 'index'])
    ->name('feed.index');
    
Route::get('/feed/fetch', [FeedController::class, 'fetch'])
    ->name('feed.fetch');

Route::get('/prompts', [PromptController::class, 'index'])
    ->name('prompts.index');

Route::get('/prompts/{prompt}-{slug}', [PromptController::class, 'show'])
    ->whereNumber('prompt')
    ->where('slug', '^[a-z0-9\-]+$')
    ->name('prompts.show');

Route::get('/search', [FeedController::class, 'search'])
    ->name('feed.search');

Route::get('/u/{username}', [ProfileController::class, 'show'])
    ->where('username', '^[A-Za-z0-9_.-]+$')
    ->name('profile.show');

require __DIR__ . '/auth.php';
require __DIR__ . '/user.php';
