<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;  // Add the SoftDeletes import

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;  // Use the SoftDeletes trait

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'image',
        'role',
        'status',
        'address',
        'date_of_birth',
        'facebook',
        'twitter',
        'instagram',
        'linkedin',
        'about',
        'description',
        'education',
        'experience',
        'skill',
        'achievement',
        'philosophy',
        'children',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function enrolledServices()
    {
        return $this->hasMany(EnrollService::class, 'user_id');
    }
}

