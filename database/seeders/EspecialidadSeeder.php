<?php

namespace Database\Seeders;

use App\Models\Specialty;
use Illuminate\Database\Seeder;

class EspecialidadSeeder extends Seeder
{
    public function run(): void
    {
        $datos = [
            ['nombre' => 'Kinesiología Deportiva', 'descripcion' => 'Rehabilitación de lesiones en deportistas.'],
            ['nombre' => 'Neurorehabilitación', 'descripcion' => 'Tratamiento de afecciones del sistema nervioso.'],
            ['nombre' => 'Piso Pélvico', 'descripcion' => 'Especialidad en disfunciones de suelo pélvico.'],
            ['nombre' => 'Kinesiología Respiratoria', 'descripcion' => 'Tratamiento de patologías pulmonares.'],
        ];

        foreach ($datos as $item) {
            Specialty::create($item);
        }
    }
}