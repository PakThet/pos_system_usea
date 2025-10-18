<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cashiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->string('employee_id')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->string('avatar')->nullable();
            $table->enum('status', ['active', 'inactive', 'on-break'])->default('active');
            $table->enum('role', ['cashier', 'senior-cashier', 'head-cashier'])->default('cashier');
            $table->enum('shift', ['morning', 'afternoon', 'evening', 'night'])->default('morning');
            $table->decimal('hourly_rate', 8, 2);
            $table->integer('total_hours')->default(0);
            $table->decimal('total_sales', 12, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->timestamp('last_login_at')->nullable();
            $table->json('permissions')->nullable();
            $table->timestamps();

            $table->index(['store_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cashiers');
    }
};