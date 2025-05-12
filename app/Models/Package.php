<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'service_id',
        'price',
        'is_active',
        'image'
    ];

    public function services()
    {
        return $this->belongsToMany(Service::class,  'package_id', 'service_id');
    }
}
