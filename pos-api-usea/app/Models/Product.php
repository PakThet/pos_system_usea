<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'image',
        'store_id',
        'category_id',
        'name',
        'description',
        'sku',
        'slug',
        'barcode',
        'price',
        'cost_price',
        'tax_rate',
        'status',
        'quantity',
        'quantity_alert',
        'discount',
    ];

    protected $casts = [
        'status' => 'string',
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'tax_rate' => 'decimal:2',
        'discount' => 'decimal:2',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}