<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profesional extends Model
{
    use HasFactory;

    protected $fillable = [
        'especialidad_id',
        'nombre',
        'apellido',
        'email',
        'telefono',
    ];

    public function specialty()
    {
        return $this->belongsTo(Specialty::class, 'especialidad_id');
    }
}