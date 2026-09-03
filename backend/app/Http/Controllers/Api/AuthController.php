<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a contributor and sign them straight in.
     *
     * Deliberately no email-confirmation step: the Supabase build blocked every
     * signup behind a rate-limited confirmation mail. Verification can be added
     * later as a non-blocking flag rather than a gate on first login.
     */
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['nullable', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(6)],
        ]);

        $user = DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => ($data['name'] ?? '') ?: str($data['email'])->before('@')->toString(),
                'email' => $data['email'],
                'password' => $data['password'],
            ]);

            $user->ensureProfile();

            return $user;
        });

        return response()->json([
            'token' => $user->createToken('aidesk-web')->plainTextToken,
            'user' => new UserResource($user->load('profile')),
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            // One message for both cases so the endpoint can't be used to
            // enumerate which addresses are registered.
            throw ValidationException::withMessages([
                'email' => ['These credentials do not match our records.'],
            ]);
        }

        $user->ensureProfile();

        return response()->json([
            'token' => $user->createToken('aidesk-web')->plainTextToken,
            'user' => new UserResource($user->load('profile')),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->ensureProfile();

        return response()->json([
            'user' => new UserResource($user->load('profile')),
        ]);
    }

    /** Revoke only the token that made this request, not every session. */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Signed out.']);
    }
}
