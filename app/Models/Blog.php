<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    //
    use HasFactory;

    protected $table = 'blogs';
    protected $fillable = [
        'title',
        'short_description',
        'details',
        'category_id',
        'user_id',
        'role',
        'add_to_popular',
        'publish',
        'image',
    ];


    public function category()
    {
        return $this->belongsTo(BlogCategory::class, 'category_id');
    }
}
