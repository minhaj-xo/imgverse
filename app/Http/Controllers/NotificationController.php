<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Safety guard (should already be protected by middleware)
        if (! $user) {
            return redirect()->route('login');
        }

        $notifications = $user->notifications()
            ->latest()
            ->limit(12)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->data['type'] ?? 'system',
                    'message' => $notification->data['message'] ?? 'You have a new notification.',
                    'link' => $notification->data['link'] ?? null,
                    'is_read' => $notification->read_at !== null,
                    'created_at' => $notification->created_at->diffForHumans(),
                ];
            });

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }
}
