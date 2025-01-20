<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function InvoiceItems()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function storage()
    {
        return $this->belongsTo(Storage::class);
    }
}
