<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use App\Models\Paciente;
use App\Models\Profesional;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CitaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $citas = Cita::with(['paciente', 'profesional.specialty'])
            ->when($search, function ($query, $search) {
                $query->whereHas('paciente', function ($q) use ($search) {
                    $q->where('nombre', 'like', "%{$search}%")
                      ->orWhere('apellido', 'like', "%{$search}%")
                      ->orWhere('rut', 'like', "%{$search}%");
                });
            })
            ->orderBy('fecha_hora', 'asc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Citas/Index', [
            'citas' => $citas,
            'pacientes' => fn () => Paciente::select('id', 'nombre', 'apellido', 'rut')->orderBy('nombre')->get(),
            'profesionales' => fn () => Profesional::with('specialty:id,nombre')->select('id', 'nombre', 'apellido', 'especialidad_id')->orderBy('nombre')->get(),
            'filters' => $request->only(['search'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'profesional_id' => 'required|exists:profesionals,id',
            'fecha_hora' => [
                'required',
                'date',
                Rule::unique('citas')->where(function ($query) use ($request) {
                    return $query->where('profesional_id', $request->profesional_id);
                })
            ],
            'estado' => 'required|in:pendiente,confirmada,cancelada',
            'observaciones' => 'nullable|string',
        ], [
            'fecha_hora.unique' => 'El profesional seleccionado ya tiene una cita agendada en este bloque horario.',
        ]);

        Cita::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, Cita $cita)
    {
        $validated = $request->validate([
            'paciente_id' => 'required|exists:pacientes,id',
            'profesional_id' => 'required|exists:profesionals,id',
            'fecha_hora' => [
                'required',
                'date',
                Rule::unique('citas')->where(function ($query) use ($request) {
                    return $query->where('profesional_id', $request->profesional_id);
                })->ignore($cita->id)
            ],
            'estado' => 'required|in:pendiente,confirmada,cancelada',
            'observaciones' => 'nullable|string',
        ], [
            'fecha_hora.unique' => 'El profesional seleccionado ya tiene una cita agendada en este bloque horario.',
        ]);

        $cita->update($validated);

        return redirect()->back();
    }

    public function destroy(Cita $cita)
    {
        $cita->delete();

        return redirect()->back();
    }
}