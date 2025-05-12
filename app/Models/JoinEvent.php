<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JoinEvent extends Model
{
    use HasFactory;
    protected $fillable = [
        'event_id',
        'ticket',
        'user_id',
        'name',
        'currency',
        'langCode',
        'total',
        'status',
        'method',
        'is_paid',
        'payment_id',
    ];
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
