<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Prompt extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $guarded = ['id'];

    protected $casts = [
        'nsfw' => 'boolean',
        'like_count' => 'integer',
        'comment_count' => 'integer',
        'save_count' => 'integer',
        'view_count' => 'integer',
        'published_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(PromptImage::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'prompt_tag')->withTimestamps();
    }

    public function likes()
    {
        return $this->hasMany(PromptLike::class);
    }

    public function saves()
    {
        return $this->hasMany(PromptSave::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function scopePublicActive($query)
    {
        return $query->where('visibility', 'public')
            ->where('status', 'active')
            ->whereNull('deleted_at')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeWithBasicRelations($query)
    {
        return $query->with([
            'user:id,username,avatar_url',
            'images:id,prompt_id,path,position,width,height'
        ]);
    }

    public function scopeTrending($query)
    {
        return $query->orderByRaw('(like_count * 4 + comment_count * 2 + save_count) DESC')
                    ->orderBy('published_at', 'desc');
    }

    public function scopeNewest($query)
    {
        return $query->orderBy('published_at', 'desc');
    }

}
