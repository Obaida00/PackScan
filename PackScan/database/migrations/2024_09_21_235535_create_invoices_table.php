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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->unsignedBigInteger('invoice_id');
            $table->index('invoice_id');

            $table->foreignId('storage_id')->nullable()->constrained('storages')->onDelete('cascade');
            $table->foreignId('packer_id')->nullable()->constrained('packers')->onDelete('set null');
            $table->string('statement')->nullable();
            $table->string('pharmacist')->nullable();
            $table->string('date')->nullable();
            $table->float('net_price')->nullable();
            $table->enum('status', ['Pending', 'In Progress', 'Done', 'Sent'])->nullable();
            $table->integer('number_of_packages')->nullable();
            $table->enum('submittion_mode', ['M', 'A'])->nullable();

            $table->boolean('is_important')->default(false)->nullable();
            $table->boolean('is_missing')->default(false);

            $table->timestamp('done_at')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
