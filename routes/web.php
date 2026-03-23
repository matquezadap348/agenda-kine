<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SpecialtyController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/especialidades', [SpecialtyController::class, 'index'])->name('especialidades.index');
    Route::post('/especialidades', [SpecialtyController::class, 'store'])->name('especialidades.store');
    Route::patch('/especialidades/{specialty}', [SpecialtyController::class, 'update'])->name('especialidades.update');
    Route::delete('/especialidades/{specialty}', [SpecialtyController::class, 'destroy'])->name('especialidades.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';