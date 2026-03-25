<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'theme' => 'required|in:light,dark,system',
        ]);

        if ($request->user()) {
            $request->user()->update([
                'theme_preference' => $validated['theme'],
            ]);
        }

        return back();
    }
}
