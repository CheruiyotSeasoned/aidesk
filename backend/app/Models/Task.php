<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'difficulty',
        'pay_rate_min',
        'pay_rate_max',
        'estimated_hours_min',
        'estimated_hours_max',
        'available_slots',
        'requirements',
        'requires_approval',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'requirements' => 'array',
            'requires_approval' => 'boolean',
            'is_active' => 'boolean',
            'pay_rate_min' => 'decimal:2',
            'pay_rate_max' => 'decimal:2',
            'estimated_hours_min' => 'decimal:1',
            'estimated_hours_max' => 'decimal:1',
        ];
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TaskAssignment::class);
    }

    /** Slots minus everyone currently holding the task. */
    public function remainingSlots(): int
    {
        $taken = $this->assignments()
            ->whereIn('status', ['claimed', 'in_progress', 'submitted', 'approved'])
            ->count();

        return max(0, $this->available_slots - $taken);
    }

    /** Display string matching what the React UI already renders. */
    public function payRateLabel(): string
    {
        return '$' . rtrim(rtrim($this->pay_rate_min, '0'), '.')
            . '-' . rtrim(rtrim($this->pay_rate_max, '0'), '.') . '/hour';
    }

    public function estimatedTimeLabel(): string
    {
        return rtrim(rtrim($this->estimated_hours_min, '0'), '.')
            . '-' . rtrim(rtrim($this->estimated_hours_max, '0'), '.') . ' hours';
    }
}
