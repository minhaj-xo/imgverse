<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the public profile of a user.
     */
    public function show(string $username, Request $request): Response
    {
        $viewer = $request->user();

        // 1. Fetch user with calculated counts
        $user = User::where('username', $username)
            ->whereNull('deleted_at')
            ->withCount([
                'followers',
                'following',
                'prompts as prompts_count' => function ($q) {
                    $q->publicActive();
                },
            ])
            ->firstOrFail();

        // 2. Build the Prompts query
        $promptsQuery = $user->prompts()
            ->publicActive()
            ->withBasicRelations()
            ->orderByDesc('published_at');

        // 3. If viewer is logged in, check if they liked/saved these specific posts
        if ($viewer) {
            $promptsQuery->withExists([
                'likes as is_liked' => function ($q) use ($viewer) {
                    $q->where('user_id', $viewer->id);
                },
                'saves as is_saved' => function ($q) use ($viewer) {
                    $q->where('user_id', $viewer->id);
                },
            ]);
        }

        // 4. Get the prompts (limiting to 24 for the initial grid)
        $prompts = $promptsQuery->limit(24)->get();

        return Inertia::render('Profile/Show', [
            'profileUser' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'avatar_url' => $user->avatar_url,
                'bio' => $user->bio,
                'website_url' => $user->website_url,
                'location' => $user->location,
                'followers_count' => $user->followers_count,
                'following_count' => $user->following_count,
                'prompts_count' => $user->prompts_count,
            ],
            'prompts' => $prompts,
        ]);
    }

    /**
     * Show the profile edit form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('Profile/Settings', [
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'name' => $user->name,
                'bio' => $user->bio,
                'website_url' => $user->website_url,
                'location' => $user->location,
                'avatar_url' => $user->avatar_url,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        // Validate incoming data
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:100'],
            'bio' => ['nullable', 'string', 'max:280'],
            'website_url' => ['nullable', 'url', 'max:255'],
            'location' => ['nullable', 'string', 'max:100'],
            'avatar' => ['nullable', 'image', 'max:1024'], // 1MB Max
        ]);

        // Handle Avatar Upload
        if ($request->hasFile('avatar')) {
            // Delete old avatar file from storage if it exists
            if ($user->avatar_url) {
                // Convert full URL back to relative path: 'avatars/filename.jpg'
                $oldPath = str_replace(asset('storage/'), '', $user->avatar_url);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new file in 'public/avatars'
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // Generate public URL
            $validated['avatar_url'] = asset('storage/' . $path);
        }

        // Remove the 'avatar' file object from the array so we don't try to save it to DB
        unset($validated['avatar']);

        // Update the user model
        $user->update($validated);

        // Redirect back to settings with a success message
        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }
}