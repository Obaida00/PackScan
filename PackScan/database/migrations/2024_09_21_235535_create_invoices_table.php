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
            $table->id();

            $table->foreignId('storage_id')->constrained('storages')->onDelete('cascade');
            $table->foreignId('packer_id')->nullable()->constrained('packers')->onDelete('set null');
            $table->string('manager');
            $table->string('statement');
            $table->string('pharmacist');
            $table->string('date');
            $table->string('net_price');
            $table->enum('status', ['Pending', 'In Progress', 'Done', 'Sent']);
            $table->integer('number_of_packages')->nullable();
            $table->enum('submittion_mode', ['M', 'A'])->nullable();
            $table->boolean('is_important')->default(false);

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
