<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PacienteController extends Controller
{
    public function index()
    {
        $pacientes = Paciente::latest()->get();

        return Inertia::render('Pacientes/Index', [
            'pacientes' => $pacientes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rut' => 'required|string|unique:pacientes,rut|max:12',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'nullable|email|unique:pacientes,email|max:255',
            'telefono' => 'required|string|max:20',
            'fecha_nacimiento' => 'required|date',
            'direccion' => 'nullable|string|max:255',
        ]);

        Paciente::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Paciente $paciente)
    {
        $validated = $request->validate([
            'rut' => 'required|string|max:12|unique:pacientes,rut,' . $paciente->id,
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'nullable|email|max:255|unique:pacientes,email,' . $paciente->id,
            'telefono' => 'required|string|max:20',
            'fecha_nacimiento' => 'required|date',
            'direccion' => 'nullable|string|max:255',
        ]);

        $paciente->update($validated);

        return redirect()->back();
    }

    public function destroy(Paciente $paciente)
    {
        $paciente->delete();

        return redirect()->back();
    }
}