<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Storage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'barcode_id',
        'name',
        'code',
    ];

    public $incrementing = false;
    protected $keyType = 'string';


    public function invoices() : HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function collections() : HasMany
    {
        return $this->hasMany(Collection::class);
    }
}
