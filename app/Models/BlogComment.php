<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BlogComment extends Model
{
    //
    use HasFactory;

    protected $table = 'blog_comments';

    protected $fillable = [
        'user_id',
        'blog_id',
        'parent_id',
        'content',
    ];

    public function replies()
    {
        return $this->hasMany(BlogComment::class, 'parent_id', 'id')->with('replies');
    }

    public function parent()
    {
        return $this->belongsTo(BlogComment::class, 'parent_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
