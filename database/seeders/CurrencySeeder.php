<?php

namespace Database\Seeders;

use App\Models\Currency;
use Illuminate\Database\Seeder;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Currency::create([
            'name' => 'USD',
            'symbol' => '$',
            'code' => 'USD',
            'placement' => 'Before',
            'default' => 1,
            'rate' => '1',
        ]);
    }
}
