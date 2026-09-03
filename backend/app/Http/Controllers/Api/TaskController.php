<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use App\Models\TaskAssignment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /** Catalogue, decorated with this user's lock/claim state. */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $approved = $user->ensureProfile()->isApproved();

        $assignments = $user->assignments()->pluck('status', 'task_id');

        $tasks = Task::where('is_active', true)
            ->orderBy('category')
            ->orderBy('title')
            ->get()
            ->each(function (Task $task) use ($approved, $assignments) {
                $status = $assignments[$task->id] ?? null;

                $task->locked = $task->requires_approval && ! $approved;
                $task->completed = $status === 'approved';
                $task->assignment_status = $status;
            });

        return response()->json(['tasks' => TaskResource::collection($tasks)]);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        $status = $user->assignments()->where('task_id', $task->id)->value('status');

        $task->locked = $task->requires_approval && ! $user->ensureProfile()->isApproved();
        $task->completed = $status === 'approved';
        $task->assignment_status = $status;

        return response()->json(['task' => new TaskResource($task)]);
    }

    /**
     * Claim a slot. Wrapped in a transaction with a row lock so two contributors
     * racing for the last slot can't both win it.
     */
    public function claim(Request $request, Task $task): JsonResponse
    {
        $user = $request->user();
        $profile = $user->ensureProfile();

        if ($task->requires_approval && ! $profile->isApproved()) {
            return response()->json([
                'message' => 'Your account is still being reviewed. You can claim tasks once approved.',
            ], 403);
        }

        if (! $task->is_active) {
            return response()->json(['message' => 'This task is no longer available.'], 422);
        }

        try {
            $assignment = DB::transaction(function () use ($task, $user) {
                $locked = Task::whereKey($task->id)->lockForUpdate()->first();

                if ($locked->remainingSlots() < 1) {
                    return null;
                }

                return TaskAssignment::create([
                    'task_id' => $locked->id,
                    'user_id' => $user->id,
                    'status' => 'claimed',
                    'claimed_at' => now(),
                ]);
            });
        } catch (\Illuminate\Database\UniqueConstraintViolationException) {
            return response()->json(['message' => 'You have already claimed this task.'], 409);
        }

        if (! $assignment) {
            return response()->json(['message' => 'All slots for this task are taken.'], 409);
        }

        return response()->json([
            'message' => 'Task claimed.',
            'assignment' => $assignment->load('task'),
        ], 201);
    }

    /** Tasks this user currently holds, in any state. */
    public function mine(Request $request): JsonResponse
    {
        $assignments = $request->user()
            ->assignments()
            ->with('task')
            ->latest('claimed_at')
            ->get();

        return response()->json(['assignments' => $assignments]);
    }

    public function submit(Request $request, TaskAssignment $assignment): JsonResponse
    {
        if ($assignment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Not your assignment.'], 403);
        }

        if (in_array($assignment->status, ['submitted', 'approved'], true)) {
            return response()->json(['message' => 'This task was already submitted.'], 422);
        }

        $data = $request->validate([
            'hours_logged' => ['required', 'numeric', 'min:0.25', 'max:999'],
            'submission_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $assignment->update([
            'status' => 'submitted',
            'hours_logged' => $data['hours_logged'],
            'submission_notes' => $data['submission_notes'] ?? null,
            'submitted_at' => now(),
        ]);

        return response()->json([
            'message' => 'Submitted for review.',
            'assignment' => $assignment->load('task'),
        ]);
    }
}
