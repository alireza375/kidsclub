<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class User_Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'uid',
        'user_id',
        'subscription_id',
        'currency',
        'langCode',
        'price',
        'active',
        'method',
        'is_paid',
        'payment_id',
    ];
}
