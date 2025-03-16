<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('description')->nullable();
            $table->integer('total_count')->default(-1);
            $table->integer('gifted_quantity')->default(-1);
            $table->integer('quantity')->default(-1);
            $table->integer('current_count')->default(0);
            $table->float('total_price')->default(-1);
            $table->float('public_price')->default(-1);
            $table->float('unit_price')->default(-1);
            $table->float('discount')->default(-1);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
