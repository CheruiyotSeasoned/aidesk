<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'difficulty' => $this->difficulty,
            'payRate' => $this->payRateLabel(),
            'payRateMin' => (float) $this->pay_rate_min,
            'payRateMax' => (float) $this->pay_rate_max,
            'estimatedTime' => $this->estimatedTimeLabel(),
            'availableSlots' => $this->remainingSlots(),
            'requirements' => $this->requirements ?? [],
            // TaskController decorates each model with these before rendering,
            // since "locked" depends on the calling user's approval status.
            'locked' => (bool) ($this->resource->locked ?? true),
            'completed' => (bool) ($this->resource->completed ?? false),
            'assignmentStatus' => $this->resource->assignment_status ?? null,
        ];
    }
}
