<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Orchid\Screen\AsSource;

class Packer extends Model
{
    use HasFactory, AsSource;

    protected $fillable = [
        'id',
        'name',
        'can_manually_submit',
        'can_submit_important_invoices'
    ];


    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
