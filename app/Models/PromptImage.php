<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PromptImage extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected $casts = [
        'position' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
    ];

    public function prompt()
    {
        return $this->belongsTo(Prompt::class);
    }
}
