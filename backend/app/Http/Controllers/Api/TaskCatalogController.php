<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;

class TaskCatalogController extends Controller
{
    /**
     * Public catalogue for the marketing site's "Available Tasks" dialog, which
     * renders before anyone signs in. Everything shows as locked - claiming
     * requires an account.
     */
    public function index(): JsonResponse
    {
        $tasks = Task::where('is_active', true)
            ->orderBy('category')
            ->orderBy('title')
            ->get()
            ->each(function (Task $task) {
                $task->locked = true;
                $task->completed = false;
                $task->assignment_status = null;
            });

        return response()->json(['tasks' => TaskResource::collection($tasks)]);
    }
}
