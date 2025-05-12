<?php

namespace Database\Seeders;

use App\Models\GeneralSetting;
use Illuminate\Database\Seeder;

class GeneralSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        GeneralSetting::create([
           'slug' => "APP_URL",
           'value' => "backendurl",
        ]);
        GeneralSetting::create([
            'slug' => "FrontendUrl",
            'value' => "frontendurl",
         ]);
         GeneralSetting::create([
            'slug' => "AWS_URL",
            'value' => "awsurl",
         ]);
         GeneralSetting::create([
            'slug' => "IMAGE_PATH",
            'value' => "imagepath",
         ]);
         GeneralSetting::create([
            'slug' => "AWS_ACCESS_KEY_ID",
            'value' => '',
         ]);
         GeneralSetting::create([
            'slug' => "AWS_SECRET_ACCESS_KEY",
            'value' => '',
         ]);
         GeneralSetting::create([
            'slug' => "AWS_DEFAULT_REGION",
            'value' => '',
         ]);
         GeneralSetting::create([
            'slug' => "AWS_BUCKET",
            'value' => '',
         ]);
    }
}
