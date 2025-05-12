<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class languagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Language::create([
            'name' => 'English',
            'code' => 'en',
            'flag' => 'us',
            'default' => 1,
            'rtl' => 0,
            'active' => 1,
        ]);

    }
}
