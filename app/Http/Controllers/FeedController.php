<?php

namespace App\Http\Controllers;

use App\Models\Prompt;
use Illuminate\Http\Request;
use Illuminate\Pagination\Cursor;
use Inertia\Inertia;

class FeedController extends Controller
{
    public function index(Request $request)
    {
        $sort = $request->input('sort', 'trending');
        $user = $request->user();

        $query = Prompt::publicActive()
            ->withBasicRelations();

        if ($sort === 'new') {
            $query->newest();
        } else {
            $sort = 'trending';
            $query->trending();
        }

        if ($user) {
            $query->withExists([
                'likes as is_liked' => fn ($q) => $q->where('user_id', $user->id),
                'saves as is_saved' => fn ($q) => $q->where('user_id', $user->id),
            ]);
        }

        $prompts = $query->cursorPaginate(
            perPage: 12,
            columns: ['*'],
            cursorName: 'cursor'
        );

        return Inertia::render('Feed/Index', [
            'prompts' => $prompts->items(),
            'nextCursor' => optional($prompts->nextCursor())->encode(),
            'sort' => $sort,
        ]);
    }

    public function fetch(Request $request)
    {
        $sort = $request->input('sort', 'trending');
        $cursor = $request->input('cursor');
        $user = $request->user();

        $query = Prompt::publicActive()
            ->withBasicRelations();

        if ($sort === 'new') {
            $query->newest();
        } else {
            $sort = 'trending';
            $query->trending();
        }

        if ($user) {
            $query->withExists([
                'likes as is_liked' => fn ($q) => $q->where('user_id', $user->id),
                'saves as is_saved' => fn ($q) => $q->where('user_id', $user->id),
            ]);
        }

        $prompts = $query->cursorPaginate(
            perPage: 12,
            columns: ['*'],
            cursorName: 'cursor',
            cursor: $cursor ? Cursor::fromEncoded($cursor) : null
        );

        return response()->json([
            'data' => $prompts->items(),
            'next_cursor' => optional($prompts->nextCursor())->encode(),
        ]);
    }

public function liked(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $query = Prompt::publicActive()
            ->withBasicRelations()
            ->whereHas('likes', fn ($q) => $q->where('user_id', $user->id))
            ->orderByDesc('published_at')
            ->withExists([
                'likes as is_liked' => fn ($q) => $q->where('user_id', $user->id),
                'saves as is_saved' => fn ($q) => $q->where('user_id', $user->id),
            ]);

        $prompts = $query->cursorPaginate(
            perPage: 12,
            columns: ['*'],
            cursorName: 'cursor'
        );

        return Inertia::render('Feed/Liked', [
            'prompts' => $prompts->items(),
            'nextCursor' => optional($prompts->nextCursor())->encode(),
        ]);
    }

    public function saved(Request $request)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        $query = Prompt::publicActive()
            ->withBasicRelations()
            ->whereHas('saves', fn ($q) => $q->where('user_id', $user->id))
            ->orderByDesc('published_at')
            ->withExists([
                'likes as is_liked' => fn ($q) => $q->where('user_id', $user->id),
                'saves as is_saved' => fn ($q) => $q->where('user_id', $user->id),
            ]);

        $prompts = $query->cursorPaginate(
            perPage: 12,
            columns: ['*'],
            cursorName: 'cursor'
        );

        return Inertia::render('Feed/Saved', [
            'prompts' => $prompts->items(),
            'nextCursor' => optional($prompts->nextCursor())->encode(),
        ]);
    }

    public function search(Request $request)
    {
        return Inertia::render('Feed/Search', [
            'filters' => [
                'q' => $request->input('q'),
            ],
        ]);
    }
}
