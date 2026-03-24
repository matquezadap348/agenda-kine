<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Specialty;

class ProfesionalFactory extends Factory
{
    public function definition(): array
    {
        return [
            'especialidad_id' => Specialty::inRandomOrder()->value('id') ?? 1,
            'nombre' => $this->faker->firstName(),
            'apellido' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'telefono' => $this->faker->numerify('+569########'),
        ];
    }
}