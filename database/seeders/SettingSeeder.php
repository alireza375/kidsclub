<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\settings;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
           'title' => 'your title',
           'logo' => null,
           'description' => 'your description',
           'email' => 'example.com',
           'phone' => '1234567890',
           'address' => 'address',
        ]);
    }
}
