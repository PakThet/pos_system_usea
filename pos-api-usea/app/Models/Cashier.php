<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cashier extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_id',
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'status',
        'role',
        'shift',
        'hourly_rate',
        'total_hours',
        'total_sales',
        'total_transactions',
        'last_login_at',
        'permissions',
    ];

    protected $casts = [
        'status' => 'string',
        'role' => 'string',
        'shift' => 'string',
        'hourly_rate' => 'decimal:2',
        'total_sales' => 'decimal:2',
        'last_login_at' => 'datetime',
        'permissions' => 'array',
    ];

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}