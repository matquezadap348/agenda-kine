<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialtyController extends Controller
{
    public function index()
    {
        $especialidades = Specialty::all();

        return Inertia::render('Especialidades/Index', [
            'especialidades' => $especialidades
        ]);
    }

    public function store(Request $request)
    {
        $validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        Specialty::create($validados);

        return redirect()->route('especialidades.index');
    }

    public function update(Request $request, Specialty $specialty)
    {
        $validados = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $specialty->update($validados);

        return redirect()->route('especialidades.index');
    }

    public function destroy(Specialty $specialty)
    {
        $specialty->delete();

        return redirect()->route('especialidades.index');
    }
}