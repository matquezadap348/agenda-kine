<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $admin = Role::create(['name' => 'admin']);
        $secretaria = Role::create(['name' => 'secretaria']);
        $kinesiologo = Role::create(['name' => 'kinesiologo']);

        Permission::create(['name' => 'gestionar usuarios'])->assignRole($admin);
        Permission::create(['name' => 'ver agenda'])->syncRoles([$admin, $secretaria, $kinesiologo]);
        Permission::create(['name' => 'editar agenda'])->syncRoles([$admin, $secretaria]);
        Permission::create(['name' => 'eliminar citas'])->assignRole($admin);
        Permission::create(['name' => 'ver pacientes'])->syncRoles([$admin, $secretaria, $kinesiologo]);
    }
}