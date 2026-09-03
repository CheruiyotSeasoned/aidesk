<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\UserProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->ensureProfile();

        return response()->json(['user' => new UserResource($user->load('profile'))]);
    }

    public function update(Request $request): JsonResponse
    {
        $user = $request->user();
        $profile = $user->ensureProfile();

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'experience' => ['sometimes', 'nullable', 'string', 'max:255'],
            'hourly_rate' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:9999'],
            'avatar' => ['sometimes', 'nullable', 'string', 'max:2048'],
            'skills' => ['sometimes', 'array'],
            'skills.*' => ['string', 'max:100'],
            'availability' => ['sometimes', 'array'],
            'availability.hours_per_week' => ['sometimes', 'integer', 'min:0', 'max:168'],
            'availability.timezone' => ['sometimes', 'nullable', 'string', 'max:100'],
            'availability.preferred_schedule' => ['sometimes', 'nullable', 'string', 'max:100'],
            'payment_details' => ['sometimes', 'array'],
            'payment_details.method' => ['sometimes', 'in:paypal,bank_transfer'],
            'payment_details.paypal_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'payment_details.bank_account_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payment_details.bank_account_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            'payment_details.bank_routing_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            // Card fields are intentionally not accepted - storing a PAN or CVV
            // would put this service in PCI scope. Use a payment processor token.
        ]);

        if (array_key_exists('name', $data)) {
            $user->update(['name' => $data['name']]);
        }

        $profile->fill(array_intersect_key($data, array_flip([
            'phone', 'location', 'bio', 'avatar', 'experience', 'hourly_rate', 'skills', 'availability', 'payment_details',
        ])))->save();

        return response()->json(['user' => new UserResource($user->fresh()->load('profile'))]);
    }

    /**
     * Mark a single onboarding step done. The React app sends camelCase step
     * names; the stored JSON uses snake_case, matching the old Supabase column.
     */
    public function updateOnboardingStep(Request $request): JsonResponse
    {
        $data = $request->validate([
            'step' => ['required', 'in:personalInfo,skills,availability,payment,review'],
        ]);

        $map = [
            'personalInfo' => 'personal_info',
            'skills' => 'skills',
            'availability' => 'availability',
            'payment' => 'payment',
            'review' => 'review',
        ];

        $user = $request->user();
        $profile = $user->ensureProfile();

        $progress = array_merge(
            UserProfile::DEFAULT_ONBOARDING_PROGRESS,
            $profile->onboarding_progress ?? [],
            [$map[$data['step']] => true],
        );

        $profile->update(['onboarding_progress' => $progress]);

        return response()->json(['user' => new UserResource($user->fresh()->load('profile'))]);
    }

    /**
     * Finish onboarding. Accepts the whole payload the onboarding wizard collects
     * so the final step is a single request rather than one per field.
     */
    public function completeOnboarding(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:50'],
            'location' => ['sometimes', 'nullable', 'string', 'max:255'],
            'bio' => ['sometimes', 'nullable', 'string', 'max:2000'],
            'experience' => ['sometimes', 'nullable', 'string', 'max:255'],
            'hourly_rate' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:9999'],
            'skills' => ['sometimes', 'array'],
            'skills.*' => ['string', 'max:100'],
            'availability' => ['sometimes', 'array'],
            'payment_details' => ['sometimes', 'array'],
            'payment_details.method' => ['sometimes', 'in:paypal,bank_transfer'],
            'payment_details.paypal_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'payment_details.bank_account_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'payment_details.bank_account_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            'payment_details.bank_routing_number' => ['sometimes', 'nullable', 'string', 'max:64'],
            // Card fields are intentionally not accepted - storing a PAN or CVV
            // would put this service in PCI scope. Use a payment processor token.
        ]);

        $user = $request->user();
        $profile = $user->ensureProfile();

        if (array_key_exists('name', $data)) {
            $user->update(['name' => $data['name']]);
        }

        $profile->fill(array_intersect_key($data, array_flip([
            'phone', 'location', 'bio', 'experience', 'hourly_rate', 'skills', 'availability', 'payment_details',
        ])));

        $profile->onboarding_completed = true;
        $profile->onboarding_progress = array_fill_keys(
            array_keys(UserProfile::DEFAULT_ONBOARDING_PROGRESS),
            true,
        );

        // Submitting onboarding puts the contributor in the review queue.
        if ($profile->approval_status === 'pending') {
            $profile->approval_status = 'under_review';
        }

        $profile->save();

        return response()->json(['user' => new UserResource($user->fresh()->load('profile'))]);
    }
}
