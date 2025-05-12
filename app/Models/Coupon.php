<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    //
    use HasFactory;

    protected $table = 'coupons';

    protected $fillable = [
        'name',
        'code',
        'discount',
        'type',
        'usage_limit_per_user',
        'minimum_order_amount',
        'expire_at',
        'status',
    ];

}
