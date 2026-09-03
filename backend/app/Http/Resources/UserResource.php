<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Shaped to match what the React AuthContext already expects, so the
     * frontend swap is a transport change rather than a data-model change.
     */
    public function toArray(Request $request): array
    {
        $profile = $this->profile;

        return [
            'id' => (string) $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'avatar' => $profile?->avatar,
            'phone' => $profile?->phone,
            'location' => $profile?->location,
            'bio' => $profile?->bio,
            'experience' => $profile?->experience,
            'hourly_rate' => $profile?->hourly_rate !== null ? (float) $profile->hourly_rate : null,
            'skills' => $profile?->skills ?? [],
            'availability' => $profile?->availability ?? [
                'hours_per_week' => 0,
                'timezone' => '',
                'preferred_schedule' => '',
            ],
            // payment_details is $hidden on the model so it never serializes by
            // default. Return a sanitized subset instead: a user may see their own
            // payment method, but full account and card numbers never leave the API.
            'payment_details' => $this->safePaymentDetails($profile?->payment_details),
            'onboardingCompleted' => (bool) ($profile?->onboarding_completed ?? false),
            'onboardingProgress' => [
                'personalInfo' => (bool) data_get($profile?->onboarding_progress, 'personal_info', false),
                'skills' => (bool) data_get($profile?->onboarding_progress, 'skills', false),
                'availability' => (bool) data_get($profile?->onboarding_progress, 'availability', false),
                'payment' => (bool) data_get($profile?->onboarding_progress, 'payment', false),
                'review' => (bool) data_get($profile?->onboarding_progress, 'review', false),
            ],
            'approvalStatus' => $profile?->approval_status ?? 'pending',
            'approvalNotes' => $profile?->approval_notes,
        ];
    }

    /**
     * Whitelist of payment fields safe to send to the browser. Card fields are
     * excluded outright, and the bank account number is reduced to its last 4.
     */
    private function safePaymentDetails(?array $details): array
    {
        $details ??= [];
        $account = (string) ($details['bank_account_number'] ?? '');

        return [
            'method' => $details['method'] ?? 'paypal',
            'paypal_email' => $details['paypal_email'] ?? null,
            'bank_account_name' => $details['bank_account_name'] ?? null,
            'bank_account_number' => $account !== ''
                ? str_repeat('*', 8) . substr($account, -4)
                : null,
        ];
    }
}
