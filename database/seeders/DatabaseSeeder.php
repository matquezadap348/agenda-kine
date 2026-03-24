<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Paciente;
use App\Models\Profesional;
use App\Models\Cita;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        Paciente::factory(20)->create();
        Profesional::factory(20)->create();
        Cita::factory(20)->create();
    }
}