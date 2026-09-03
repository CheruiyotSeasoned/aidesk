<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The onboarding wizard requires "experience" and "hourly rate" to advance past
 * its steps, but had nowhere to store either - both were collected and dropped.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->string('experience')->nullable()->after('bio');
            $table->decimal('hourly_rate', 8, 2)->nullable()->after('experience');
        });
    }

    public function down(): void
    {
        Schema::table('user_profiles', function (Blueprint $table) {
            $table->dropColumn(['experience', 'hourly_rate']);
        });
    }
};
