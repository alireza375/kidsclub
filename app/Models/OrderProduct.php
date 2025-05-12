<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'order_id',
        'name',
        'currency',
        'langCode',
        'shipping_address',
        'items',
        'total',
        'status',
        'method',
        'discount_coupon',
        'is_paid',
        'payment_id',
        'discount'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
