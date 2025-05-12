<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Newsletter extends Model
{
    //
    use HasFactory;
    protected $table = 'newsletters';
    protected $fillable = [
        'email',
        'status',
    ];
}
