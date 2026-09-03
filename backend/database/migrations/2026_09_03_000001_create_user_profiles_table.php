<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('avatar')->nullable();
            $table->string('phone')->nullable();
            $table->string('location')->nullable();
            $table->text('bio')->nullable();

            // Mirrors the jsonb columns the Supabase schema used.
            $table->json('skills')->nullable();
            $table->json('availability')->nullable();
            $table->json('payment_details')->nullable();
            $table->json('onboarding_progress')->nullable();

            $table->boolean('onboarding_completed')->default(false);
            $table->enum('approval_status', ['pending', 'approved', 'rejected', 'under_review'])
                ->default('pending');
            $table->text('approval_notes')->nullable();
            $table->timestamps();

            $table->index('approval_status');
            $table->index('onboarding_completed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
