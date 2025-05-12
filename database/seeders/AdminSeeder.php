<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name'    => 'Admin',
            'email'         => 'admin@gmail.com',
            'phone'         => '1234567890',
            'password'      =>  Hash::make('123456'),
            'is_mail_verified' => ENABLE,
            'role'          => ADMIN,
            'status'        => ACTIVE

        ]);
    }
}
