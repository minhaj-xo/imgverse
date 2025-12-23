<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use App\Models\PromptLike;
use App\Models\PromptSave;
use App\Models\Comment; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;


class PromptController extends Controller
{
    /**
     * Display the feed.
     */
    public function index()
    {
        return Inertia::render('Prompts/Index', [
            'prompts' => Prompt::withBasicRelations()
                ->publicActive()
                ->latest()
                ->paginate(24)
        ]);
    }

    public function storeComment(Request $request, Prompt $prompt)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $prompt->comments()->create([
            'user_id' => auth()->id(),
            'body' => $validated['comment'],
            // 'depth' => 0, // optional, depending on your DB defaults
        ]);

        $prompt->increment('comment_count');

        return back()->with('success', 'Comment posted!');
    }

    /**
     * Show the creation form.
     */
    public function create()
    {
        return Inertia::render('Prompts/Create');
    }

    /**
     * Store a new prompt.
     */
    public function store(Request $request)
    {
        // Only 'title' is strictly required per your request
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'content'     => 'nullable|string', // Optional prompt text
            'ai_model'    => 'nullable|string|max:100',
            'images'      => 'nullable|array|max:4',
            'images.*'    => 'image|mimes:jpeg,png,jpg,webp|max:3072', // 3MB limit
        ]);

        $prompt = DB::transaction(function () use ($validated, $request) {
            // 1. Create the Prompt record
            // MAPPING: frontend 'content' -> database 'body'
            $prompt = $request->user()->prompts()->create([
                'title'        => $validated['title'],
                'slug'         => Str::slug($validated['title']) . '-' . Str::lower(Str::random(5)),
                'description'  => $validated['description'] ?? null,
                'body'         => $validated['content'] ?? null, 
                'ai_model'     => $validated['ai_model'] ?? 'custom',
                'status'       => 'active',
                'visibility'   => 'public',
                'published_at' => now(),
                'like_count'   => 0,
                'save_count'   => 0,
                'view_count'   => 0,
                'comment_count'=> 0,
            ]);

            // 2. Handle Image Uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    [$width, $height] = getimagesize($file);
                    $path = $file->store('prompts', 'public');
                    
                    $prompt->images()->create([
                        'path'     => $path,
                        'position' => $index,
                        'width'    => $width,
                        'height'   => $height,
                    ]);
                }
            }

            return $prompt;
        });

        return redirect()->route('feed.index')->with('success', 'Prompt posted successfully!');
    }

    /**
     * Show a single prompt.
     */
    public function show(Prompt $prompt, string $slug)
{
    if ($prompt->slug !== $slug) {
        return redirect()->to("/prompts/{$prompt->id}-{$prompt->slug}");
    }

    // Load user, images, and the comments with their authors
    $prompt->load(['user', 'images', 'comments.user']);
    $prompt->increment('view_count');

    return Inertia::render('Prompts/Show', [
        'prompt' => [
            'id' => $prompt->id,
            'title' => $prompt->title,
            'description' => $prompt->description,
            'content' => $prompt->body,
            'ai_model' => $prompt->ai_model,
            'image_urls' => $prompt->images->map(fn($img) => asset('storage/' . $img->path)),
            'user' => [
                'username' => $prompt->user->username,
                'avatar' => $prompt->user->avatar_url ?? 'https://ui-avatars.com/api/?name='.$prompt->user->username,
            ],
            'created_at_human' => $prompt->created_at->diffForHumans(),
            'stats' => [
                'likes' => $prompt->like_count,
                'comments_count' => $prompt->comment_count,
            ],
        ],
        // Format comments for the React Props
        'comments' => $prompt->comments->map(fn($comment) => [
            'id' => $comment->id,
            'user' => $comment->user->username,
            'time' => $comment->created_at->diffForHumans(),
            'text' => $comment->body, // Map DB 'body' to React 'text'
        ]),
        'isLiked' => auth()->check() ? $prompt->likes()->where('user_id', auth()->id())->exists() : false,
        'isSaved' => auth()->check() ? $prompt->saves()->where('user_id', auth()->id())->exists() : false,
    ]);
}

    /**
     * Show edit form.
     */
    public function edit(int $id)
    {
        $prompt = Prompt::with('images')->findOrFail($id);

        if ($prompt->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Prompts/Edit', [
            'prompt' => $prompt,
        ]);
    }

    /**
     * Update the prompt.
     */
    public function update(Request $request, Prompt $prompt)
    {
        if ($prompt->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'content'     => 'nullable|string', // maps to body
            'ai_model'    => 'nullable|string',
        ]);

        $prompt->update([
            'title'       => $validated['title'],
            'description' => $validated['description'],
            'body'        => $validated['content'], 
            'ai_model'    => $validated['ai_model'],
            // We only update slug if title changed significantly, 
            // but for simplicity, let's keep it stable or update it:
            'slug'        => Str::slug($validated['title']) . '-' . Str::lower(Str::random(5)),
        ]);

        return redirect()->route('prompts.show', [$prompt->id, $prompt->slug])
            ->with('success', 'Prompt updated!');
    }

    /**
     * Delete the prompt and cleanup files.
     */
    public function destroy(Prompt $prompt)
    {
        if ($prompt->user_id !== auth()->id()) {
            abort(403);
        }

        DB::transaction(function () use ($prompt) {
            // Delete actual image files from storage
            foreach ($prompt->images as $image) {
                Storage::disk('public')->delete($image->path);
            }
            $prompt->delete(); // SoftDeletes will handle the DB side
        });

        return redirect()->route('feed.index')->with('success', 'Post removed.');
    }

/**
 * Like/Unlike Toggle.
 */
public function like(Request $request, Prompt $prompt)
{
    $user = $request->user();
    $existing = PromptLike::where('user_id', $user->id)->where('prompt_id', $prompt->id)->first();

    if ($existing) {
        $existing->delete();
        $prompt->decrement('like_count');
    } else {
        PromptLike::create(['user_id' => $user->id, 'prompt_id' => $prompt->id]);
        $prompt->increment('like_count');
    }

    // DO NOT return response()->json()
    // Instead, return back to the page. Inertia will refresh the 'prompt' prop.
    return back();
}

/**
 * Save/Unsave Toggle.
 */
public function save(Request $request, Prompt $prompt)
{
    $user = $request->user();
    $existing = PromptSave::where('user_id', $user->id)->where('prompt_id', $prompt->id)->first();

    if ($existing) {
        $existing->delete();
        $prompt->decrement('save_count');
    } else {
        PromptSave::create(['user_id' => $user->id, 'prompt_id' => $prompt->id]);
        $prompt->increment('save_count');
    }

    return back();
}
}