<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        "name",
        "barcode",
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
