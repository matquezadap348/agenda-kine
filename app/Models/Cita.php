<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use DateTimeInterface;

class Cita extends Model
{
    use HasFactory;

    protected $fillable = [
        'paciente_id',
        'profesional_id',
        'fecha_hora',
        'estado',
        'observaciones',
    ];

    protected $casts = [
        'fecha_hora' => 'datetime',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i');
    }

    public function paciente()
    {
        return $this->belongsTo(Paciente::class);
    }

    public function profesional()
    {
        return $this->belongsTo(Profesional::class);
    }
}