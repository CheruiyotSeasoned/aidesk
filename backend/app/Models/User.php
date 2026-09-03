<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TaskAssignment::class);
    }

    public function earnings(): HasMany
    {
        return $this->hasMany(Earning::class);
    }

    /**
     * Every user gets a profile row on registration, but fall back to creating
     * one lazily so an older account can never 500 the dashboard.
     */
    public function ensureProfile(): UserProfile
    {
        return $this->profile()->firstOrCreate([], [
            'skills' => [],
            'availability' => UserProfile::DEFAULT_AVAILABILITY,
            'payment_details' => [],
            'onboarding_progress' => UserProfile::DEFAULT_ONBOARDING_PROGRESS,
            'onboarding_completed' => false,
            'approval_status' => 'pending',
        ]);
    }

    public function availableBalance(): float
    {
        return (float) $this->earnings()->where('status', 'available')->sum('amount');
    }

    public function pendingBalance(): float
    {
        return (float) $this->earnings()->where('status', 'pending')->sum('amount');
    }
}
