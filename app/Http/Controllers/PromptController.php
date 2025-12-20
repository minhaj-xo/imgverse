<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use App\Models\PromptLike;
use App\Models\PromptSave;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PromptController extends Controller
{
    public function index()
    {
        return Inertia::render('Prompts/Index');
    }

    public function show(int $prompt, string $slug)
    {
        return Inertia::render('Prompts/Show', [
            'promptId' => $prompt,
            'slug' => $slug,
        ]);
    }

    public function create()
    {
        return Inertia::render('Prompts/Create');
    }

    public function store(Request $request)
    {
        return redirect()->route('prompts.index');
    }

    public function edit(int $prompt)
    {
        return Inertia::render('Prompts/Edit', [
            'promptId' => $prompt,
        ]);
    }

    public function update(Request $request, int $prompt)
    {
        return redirect()->route('prompts.show', [
            'prompt' => $prompt,
            'slug' => 'placeholder',
        ]);
    }

    public function destroy(int $prompt)
    {
        return redirect()->route('prompts.index');
    }

    public function like(Request $request, Prompt $prompt)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $liked = false;

        DB::transaction(function () use ($user, $prompt, &$liked) {
            $existing = PromptLike::where('user_id', $user->id)
                ->where('prompt_id', $prompt->id)
                ->first();

            if ($existing) {
                $existing->delete();
                $prompt->decrement('like_count');
                $liked = false;
            } else {
                PromptLike::create([
                    'user_id' => $user->id,
                    'prompt_id' => $prompt->id,
                ]);
                $prompt->increment('like_count');
                $liked = true;
            }

            $prompt->refresh();
        });

        return response()->json([
            'liked' => $liked,
            'like_count' => $prompt->like_count,
        ]);
    }

    public function save(Request $request, Prompt $prompt)
    {
        $user = $request->user();

        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $saved = false;

        DB::transaction(function () use ($user, $prompt, &$saved) {
            $existing = PromptSave::where('user_id', $user->id)
                ->where('prompt_id', $prompt->id)
                ->first();

            if ($existing) {
                $existing->delete();
                $prompt->decrement('save_count');
                $saved = false;
            } else {
                PromptSave::create([
                    'user_id' => $user->id,
                    'prompt_id' => $prompt->id,
                ]);
                $prompt->increment('save_count');
                $saved = true;
            }

            $prompt->refresh();
        });

        return response()->json([
            'saved' => $saved,
            'save_count' => $prompt->save_count,
        ]);
    }
}
