<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnrollService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'user_id',
        'name',
        'currency',
        'langCode',
        'total',
        'status',
        'method',
        'is_paid',
        'payment_id',
        'child_id',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function service()
    {
        return $this->belongsTo(Service::class, 'service_id');
    }

    public function child()
    {
        return $this->belongsTo(Children::class, 'child_id', 'id');
    }

    public function children()
    {
        return $this->belongsTo(Children::class, 'user_id');
    }

}
