<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Packer extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'can_manually_submit',
        'can_submit_important_invoices',
        'is_invoice_admin'
    ];


    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
