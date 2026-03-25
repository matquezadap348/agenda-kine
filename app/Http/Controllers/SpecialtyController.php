<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecialtyController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $especialidades = Specialty::when($search, function ($query, $search) {
                $query->where('nombre', 'like', "%{$search}%");
            })
            ->orderBy('nombre')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Especialidades/Index', [
            'especialidades' => $especialidades,
            'filters' => ['search' => $search]
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