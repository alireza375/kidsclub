<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'title',
        'description',
        'image',
        'instructor_id',
        'price',
        'discount_price',
        'discount',
        'discount_type',
        'category',
        'session',
        'duration',
        'capacity',
        'is_active',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id', 'id');
    }

    public function notices()
    {
        return $this->hasMany(ServiceNotice::class, 'service_id');
    }

    public function faqs()
    {
        return $this->hasMany(ServiceFaq::class, 'service_id');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class, 'service_id');
    }
    public function enrollServices()
    {
        return $this->hasMany(EnrollService::class, 'service_id');
    }

}
