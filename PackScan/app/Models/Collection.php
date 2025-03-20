<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collection extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillables = [
        'name',
        'storage_id'
    ];

    public function storage()
    {
        return $this->belongsTo(Storage::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
