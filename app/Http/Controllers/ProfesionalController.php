<?php

namespace App\Http\Controllers;

use App\Models\Profesional;
use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProfesionalController extends Controller
{
    public function index()
    {
        $profesionales = Profesional::with('specialty')->latest()->get();
        $especialidades = Specialty::orderBy('nombre')->get();

        return Inertia::render('Profesionales/Index', [
            'profesionales' => $profesionales,
            'especialidades' => $especialidades,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'especialidad_id' => 'required|exists:especialidades,id',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:profesionals,email',
            'telefono' => 'nullable|string|max:20',
        ]);

        Profesional::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Profesional $profesional)
    {
        $validated = $request->validate([
            'especialidad_id' => 'required|exists:especialidades,id',
            'nombre' => 'required|string|max:255',
            'apellido' => 'required|string|max:255',
            'email' => 'required|email|unique:profesionals,email,' . $profesional->id,
            'telefono' => 'nullable|string|max:20',
        ]);

        $profesional->update($validated);

        return redirect()->back();
    }

    public function destroy(Profesional $profesional)
    {
        $profesional->delete();

        return redirect()->back();
    }
}