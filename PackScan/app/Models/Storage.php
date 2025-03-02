<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'code',
    ];

    public $incrementing = false;
    protected $keyType = 'string';


    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
