<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PacienteFactory extends Factory
{
    public function definition(): array
    {
        return [
            'rut' => $this->faker->unique()->numerify('########-').$this->faker->randomElement(['0','1','2','3','4','5','6','7','8','9','K']),
            'nombre' => $this->faker->firstName(),
            'apellido' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'telefono' => $this->faker->numerify('+569########'),
            'fecha_nacimiento' => $this->faker->date('Y-m-d', '-18 years'),
            'direccion' => $this->faker->address(),
        ];
    }
}