<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Specialty extends Model
{
    // Le indicamos a Laravel que la tabla se llama así en la DB
    protected $table = 'especialidades';

    // Definimos qué campos se pueden llenar masivamente
    protected $fillable = [
        'nombre',
        'descripcion',
    ];
}