<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('packers', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->boolean('can_manually_submit');
            $table->boolean('can_submit_important_invoices');
            $table->boolean('is_invoice_admin');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packers');
    }
};
