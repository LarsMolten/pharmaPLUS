<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer les rôles
        $roles = ['superAdmin', 'pharmacien', 'caissier', 'manager'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role]);
        }

        // Créer le superAdmin s’il n’existe pas
        $superAdmin = User::firstOrCreate(
            ['username' => 'superadmin'],
            [
                'name' => 'Lars Molten',
                'password' => Hash::make('larsmolten'),
            ]
        );

        // Lui attribuer le rôle
        if (! $superAdmin->hasRole('superAdmin')) {
            $superAdmin->assignRole('superAdmin');
        }
    }
}
