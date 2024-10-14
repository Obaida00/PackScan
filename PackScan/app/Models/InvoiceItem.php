<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceItem extends Model
{
    use HasFactory;

    protected $fillable = [
        "id",
        "totalCount"
    ];

    public function invoice(){
        return $this->belongsTo(Invoice::class);
    }

    public function packageItem(){
        return $this->belongsTo(PackageItem::class); 
    }
}
