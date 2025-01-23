<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'manager',
        'storage_id',
        'pharmacist',
        'status'
        // todo 'file'
    ];

    public function invoiceItems() : HasMany
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function storage() : BelongsTo
    {
        return $this->belongsTo(Storage::class);
    }
}
