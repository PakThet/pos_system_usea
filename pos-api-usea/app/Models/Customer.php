<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'status',
        'tier',
        'total_orders',
        'total_spent',
        'last_order_at',
        'notes',
    ];

    protected $casts = [
        'status' => 'string',
        'tier' => 'string',
        'total_spent' => 'decimal:2',
        'last_order_at' => 'datetime',
    ];

    public function addresses(): HasMany
    {
        return $this->hasMany(CustomerAddress::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function getDefaultShippingAddressAttribute()
    {
        return $this->addresses()->where('type', 'shipping')->orWhere('type', 'both')->first();
    }

    public function getDefaultBillingAddressAttribute()
    {
        return $this->addresses()->where('type', 'billing')->orWhere('type', 'both')->first();
    }
}