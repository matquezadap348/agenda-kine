<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Creamos el usuario de prueba
        User::factory()->create([
            'name' => 'Usuario Test',
            'email' => 'test@example.com',
        ]);

        // Llamamos a la siembra de especialidades en español
        $this->call(EspecialidadSeeder::class);
    }
}