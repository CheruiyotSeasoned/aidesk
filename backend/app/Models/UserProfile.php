<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'avatar',
        'phone',
        'location',
        'bio',
        'experience',
        'hourly_rate',
        'skills',
        'availability',
        'payment_details',
        'onboarding_progress',
        'onboarding_completed',
        'approval_status',
        'approval_notes',
    ];

    protected function casts(): array
    {
        return [
            'skills' => 'array',
            'availability' => 'array',
            'payment_details' => 'array',
            'onboarding_progress' => 'array',
            'onboarding_completed' => 'boolean',
            'hourly_rate' => 'decimal:2',
        ];
    }

    /**
     * Payment details hold bank/card fields, so they must never ride along in a
     * default serialization. ProfileController exposes only what the UI needs.
     */
    protected $hidden = ['payment_details'];

    public const DEFAULT_ONBOARDING_PROGRESS = [
        'personal_info' => false,
        'skills' => false,
        'availability' => false,
        'payment' => false,
        'review' => false,
    ];

    public const DEFAULT_AVAILABILITY = [
        'hours_per_week' => 0,
        'timezone' => '',
        'preferred_schedule' => '',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }
}
