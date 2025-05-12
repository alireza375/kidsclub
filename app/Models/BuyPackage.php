<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BuyPackage extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'user_id',
        'currency',
        'total',
        'status',
        'method',
        'is_paid',
        'payment_id',
    ];

    public function package()
    {
        return $this->belongsTo(Package::class);
    }

    // If you need to fetch services from the service_id JSON column in Package
    public function getServices()
    {
        $serviceIds = json_decode($this->package->service_id, true); // Decode the JSON array
        return Service::whereIn('id', $serviceIds)->get(); // Fetch the services based on the IDs
    }
}
