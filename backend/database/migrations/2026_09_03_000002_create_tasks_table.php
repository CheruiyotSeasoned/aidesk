<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('category');
            $table->enum('difficulty', ['Beginner', 'Intermediate', 'Advanced'])->default('Beginner');

            // The frontend showed pay as a "$15-25/hour" string. Store it numerically
            // so it can be filtered and summed, and format for display in the UI.
            $table->decimal('pay_rate_min', 8, 2);
            $table->decimal('pay_rate_max', 8, 2);
            $table->decimal('estimated_hours_min', 5, 1)->default(1);
            $table->decimal('estimated_hours_max', 5, 1)->default(2);

            $table->unsignedInteger('available_slots')->default(0);
            $table->json('requirements')->nullable();

            // Contributors must be approved before a task unlocks.
            $table->boolean('requires_approval')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('category');
            $table->index('is_active');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
