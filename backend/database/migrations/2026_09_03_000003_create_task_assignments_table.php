<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('task_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('task_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->enum('status', ['claimed', 'in_progress', 'submitted', 'approved', 'rejected'])
                ->default('claimed');
            $table->decimal('hours_logged', 6, 2)->default(0);
            $table->decimal('amount_earned', 10, 2)->default(0);
            $table->text('submission_notes')->nullable();
            $table->text('review_notes')->nullable();

            $table->timestamp('claimed_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            // A contributor can only hold one assignment per task.
            $table->unique(['task_id', 'user_id']);
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('task_assignments');
    }
};
