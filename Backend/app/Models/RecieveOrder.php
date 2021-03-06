<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecieveOrder extends Model
{
    use HasFactory;

    protected $fillable=["supplier_order_id","product_id","qty"];
}
