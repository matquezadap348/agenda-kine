<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpecialtyController;
use App\Http\Controllers\ProfesionalController;
use App\Http\Controllers\PacienteController;
use App\Http\Controllers\CitaController;
use App\Models\Cita;
use App\Models\Paciente;
use App\Models\Profesional;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard', [
            'stats' => [
                'pacientes' => Paciente::count(),
                'profesionales' => Profesional::count(),
                'citas_hoy' => Cita::whereDate('fecha_hora', Carbon::today())->count(),
                'citas_pendientes' => Cita::where('estado', 'pendiente')->count(),
            ],
            'proximas_citas' => Cita::with(['paciente', 'profesional'])
                ->where('fecha_hora', '>=', Carbon::now())
                ->orderBy('fecha_hora', 'asc')
                ->take(5)
                ->get()
        ]);
    })->name('dashboard');

    Route::middleware(['can:ver agenda'])->group(function () {
        Route::get('/citas', [CitaController::class, 'index'])->name('citas.index');
        Route::get('/pacientes', [PacienteController::class, 'index'])->name('pacientes.index');
        Route::get('/profesionales', [ProfesionalController::class, 'index'])->name('profesionales.index');
        Route::get('/especialidades', [SpecialtyController::class, 'index'])->name('especialidades.index');
    });

    Route::middleware(['can:editar agenda'])->group(function () {
        Route::post('/citas', [CitaController::class, 'store'])->name('citas.store');
        Route::patch('/citas/{cita}', [CitaController::class, 'update'])->name('citas.update');
        
        Route::post('/pacientes', [PacienteController::class, 'store'])->name('pacientes.store');
        Route::patch('/pacientes/{paciente}', [PacienteController::class, 'update'])->name('pacientes.update');

        Route::post('/especialidades', [SpecialtyController::class, 'store'])->name('especialidades.store');
        Route::patch('/especialidades/{specialty}', [SpecialtyController::class, 'update'])->name('especialidades.update');
    });

    Route::middleware(['can:gestionar usuarios'])->group(function () {
        Route::post('/profesionales', [ProfesionalController::class, 'store'])->name('profesionales.store');
        Route::patch('/profesionales/{profesional}', [ProfesionalController::class, 'update'])->name('profesionales.update');
        Route::delete('/profesionales/{profesional}', [ProfesionalController::class, 'destroy'])->name('profesionales.destroy');
        Route::delete('/especialidades/{specialty}', [SpecialtyController::class, 'destroy'])->name('especialidades.destroy');
    });

    Route::middleware(['can:eliminar citas'])->group(function () {
        Route::delete('/citas/{cita}', [CitaController::class, 'destroy'])->name('citas.destroy');
        Route::delete('/pacientes/{paciente}', [PacienteController::class, 'destroy'])->name('pacientes.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';