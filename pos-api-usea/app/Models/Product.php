<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        "image",
        "store_id",
        "category_id",
        "p_name",
        "description",
        "sku",
        "slug",
        "barcode",
        "price",
        "tax",
        "stock",
        "quantity",
        "descount",
        "quzntity_alert",
    ];

    public function store(){
        return $this->belongsTo(Store::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }
}
