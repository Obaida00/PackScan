<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageItem extends Model
{
    use HasFactory;
    protected $fillable = [
        "id",
        "name",
        "barcode",
    ];

    public function invoiceItems(){
        return $this->hasMany(InvoiceItem::class);
    }
}
