<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'short_description',
        'description',
        'price',
        'product_category_id',
        'quantity',
        'variants',
        'thumbnail_image',
        'images',
        'is_active',
        'discount',
        'discount_type',
        'discount_price'

    ];

    public function cart()
    {
        return $this->hasMany(Cart::class);
    }

    public function category()
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function reviews()
    {
        return $this->hasMany(ProductReview::class);
    }



}
