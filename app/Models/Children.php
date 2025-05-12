<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Children extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'dob',
        'relation_type',
        'image',
        'service_id',
    ];

    // service_id is an array
    protected $casts = [
        'service_id' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }


    public function enrollServices()
    {
        return $this->hasMany(EnrollService::class, 'child_id', 'id');
    }

}
