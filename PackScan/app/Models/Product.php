<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Orchid\Filters\Filterable;
use Orchid\Screen\AsSource;

class Product extends Model
{
    use HasFactory, HasUuids, AsSource, Filterable;

    protected $fillable = [
        "name",
        "barcode",
    ];

    protected $allowedSorts = [
        'name' => Like::class,
    ];


    public $incrementing = false;
    protected $keyType = 'string';

    public function invoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }
}
