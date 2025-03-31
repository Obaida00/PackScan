<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'invoice_id',
        'storage_id',
        'statement',
        'pharmacist',
        'date',
        'status',
        'net_price',
        'number_of_items',
        'is_missing',
        'total_price',
        'total_discount',
        'balance',
        'net_price_in_words',
        'deputy_number'
    ];

    public $incrementing = false;
    protected $keyType = 'string';

    public function invoiceItems() : HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function storage() : BelongsTo
    {
        return $this->belongsTo(Storage::class);
    }
    
    public function packer() : BelongsTo
    {
        return $this->belongsTo(Packer::class);
    }
}
