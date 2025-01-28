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
    ];

    
    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
