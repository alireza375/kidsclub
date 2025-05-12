<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{

    use HasFactory;
    protected $fillable = [
        'title',
        'image',
        'slug',
        'type',
        'description',
        'event_date',
        'start_time',
        'end_time',
        'members',
        'instructor_id',
        'location',
        'price',
        'discount',
        'organizer',
        'discount_type',
        'contact_address',
        'contact_email',
        'contact_phone',
        'event_news',
        'event_category',
        'is_active'
    ];

    protected $casts = [
        'members' => 'array',
    ];
    public function joinEvents()
    {
        return $this->hasMany(JoinEvent::class, 'event_id');
    }
}
