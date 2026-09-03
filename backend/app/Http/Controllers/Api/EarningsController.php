<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EarningsController extends Controller
{
    /**
     * Summary plus recent ledger entries - replaces the static numbers the
     * dashboard's earnings view currently hardcodes.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $available = $user->availableBalance();
        $pending = $user->pendingBalance();
        $paid = (float) $user->earnings()->where('status', 'paid')->sum('amount');

        $transactions = $user->earnings()
            ->with('taskAssignment.task:id,title')
            ->latest()
            ->limit(50)
            ->get();

        return response()->json([
            'summary' => [
                'available' => round($available, 2),
                'pending' => round($pending, 2),
                // Payouts are stored negative, so flip the sign for display.
                'paid_out' => round(abs($paid), 2),
                'lifetime' => round($available + $pending, 2),
                'tasks_completed' => $user->assignments()->where('status', 'approved')->count(),
                'hours_logged' => (float) $user->assignments()->sum('hours_logged'),
            ],
            'transactions' => $transactions,
        ]);
    }
}
