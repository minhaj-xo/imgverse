<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\SocialAccount;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')
            ->scopes(['email', 'profile'])
            ->redirect();
    }

    public function callback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Throwable $e) {
            return redirect()->route('login');
        }

        $googleId = $googleUser->getId();
        $googleEmail = $googleUser->getEmail();
        $googleName = $googleUser->getName();
        $googleAvatar = $googleUser->getAvatar();

        $socialAccount = SocialAccount::where('provider', 'google')
            ->where('provider_user_id', $googleId)
            ->first();

        if ($socialAccount) {
            $user = $socialAccount->user;
        } else {
            $user = null;

            if ($googleEmail) {
                $user = User::where('email', $googleEmail)->first();
            }

            if (! $user) {
                $usernameBase = $this->makeUsernameBase($googleUser->getNickname(), $googleName, $googleEmail);
                $username = $this->generateUniqueUsername($usernameBase);

                $user = User::create([
                    'uuid' => (string) Str::uuid(),
                    'username' => $username,
                    'name' => $googleName,
                    'email' => $googleEmail,
                    'avatar_url' => $googleAvatar,
                    'role' => 'user',
                    'email_verified_at' => now(),
                ]);
            }

            $socialAccount = SocialAccount::create([
                'user_id' => $user->id,
                'provider' => 'google',
                'provider_user_id' => $googleId,
                'provider_email' => $googleEmail,
                'access_token' => $googleUser->token,
                'refresh_token' => $googleUser->refreshToken ?? null,
                'token_expires_at' => $googleUser->expiresIn
                    ? now()->addSeconds($googleUser->expiresIn)
                    : null,
            ]);
        }

        $user->avatar_url = $user->avatar_url ?: $googleAvatar;
        $user->last_login_at = now();
        $user->save();

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->route('feed.index');
    }

    protected function makeUsernameBase(?string $nickname, ?string $name, ?string $email): string
    {
        if ($nickname) {
            $base = $nickname;
        } elseif ($name) {
            $base = Str::slug($name, '');
        } elseif ($email) {
            $base = strstr($email, '@', true) ?: 'user';
        } else {
            $base = 'user';
        }

        $base = preg_replace('/[^A-Za-z0-9_.-]/', '', $base) ?: 'user';

        return strtolower($base);
    }

    protected function generateUniqueUsername(string $base): string
    {
        $username = $base;
        $suffix = 1;

        while (User::where('username', $username)->exists()) {
            $username = $base . $suffix;
            $suffix++;
        }

        return $username;
    }
}
