<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('earnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('task_assignment_id')->nullable()->constrained()->nullOnDelete();

            $table->enum('type', ['task_payment', 'bonus', 'payout', 'adjustment']);
            // Credits are positive, payouts negative, so the balance is a plain SUM.
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'available', 'paid'])->default('pending');
            $table->string('description')->nullable();
            $table->string('reference')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('earnings');
    }
};
