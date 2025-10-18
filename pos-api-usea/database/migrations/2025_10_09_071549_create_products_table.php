<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('image')->nullable();
            $table->foreignId('store_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('sku')->unique();
            $table->string('slug')->unique();
            $table->string('barcode')->unique();
            $table->decimal('price', 10, 2);
            $table->decimal('tax_rate', 5, 2)->default(0);
 $table->string('status')->default('active');
            $table->integer('quantity')->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('cost_price', 10, 2)->default(0); 
            $table->integer('quantity_alert')->default(5);
            $table->timestamps();
            
            $table->index(['store_id', 'category_id']);
            $table->index('sku');
            $table->index('barcode');
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
};