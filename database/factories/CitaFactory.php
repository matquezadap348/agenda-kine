<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Paciente;
use App\Models\Profesional;

class CitaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'paciente_id' => Paciente::inRandomOrder()->value('id'),
            'profesional_id' => Profesional::inRandomOrder()->value('id'),
            'fecha_hora' => $this->faker->dateTimeBetween('now', '+2 months')->format('Y-m-d H:i:00'),
            'estado' => $this->faker->randomElement(['pendiente', 'confirmada', 'cancelada']),
            'observaciones' => $this->faker->sentence(),
        ];
    }
}