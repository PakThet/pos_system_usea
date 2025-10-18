<?php

namespace App\Http\Controllers\Api;

use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SaleController extends ApiController
{
    public function index()
    {
        try {
            $sales = Sale::with(['store', 'customer', 'cashier', 'items.product'])->latest()->get();
            return $this->success($sales, 'Sales fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'store_id' => 'required|exists:stores,id',
                'customer_id' => 'nullable|exists:customers,id',
                'cashier_id' => 'required|exists:cashiers,id',
                'subtotal_amount' => 'required|numeric|min:0',
                'tax_amount' => 'sometimes|numeric|min:0',
                'discount_amount' => 'sometimes|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'payment_method' => 'required|in:card,cash,mobile,credit',
                'status' => 'sometimes|in:completed,pending,cancelled,refunded',
                'notes' => 'nullable|string',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
            ]);

            // Generate transaction ID
            $validated['transaction_id'] = 'TXN' . Str::upper(Str::random(8)) . time();

            // Create sale
            $sale = Sale::create($validated);

            // Create sale items and update product quantities
            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                
                $saleItem = new SaleItem([
                    'product_id' => $itemData['product_id'],
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'category_name' => $product->category->name,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'tax_rate' => $product->tax_rate,
                    'discount_amount' => $itemData['discount_amount'] ?? 0,
                    'total_price' => $itemData['unit_price'] * $itemData['quantity'],
                ]);

                $sale->items()->save($saleItem);

                // Update product quantity
                $product->decrement('quantity', $itemData['quantity']);
            }

            // Update cashier stats
            $cashier = $sale->cashier;
            $cashier->increment('total_transactions');
            $cashier->increment('total_sales', $sale->total_amount);

            return $this->success($sale->load(['store', 'customer', 'cashier', 'items.product']), 'Sale created successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Sale $sale)
    {
        try {
            $sale->load(['store', 'customer', 'cashier', 'items.product']);
            return $this->success($sale, 'Sale fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Sale $sale)
    {
        try {
            $validated = $request->validate([
                'status' => 'sometimes|in:completed,pending,cancelled,refunded',
                'notes' => 'nullable|string',
            ]);

            $sale->update($validated);
            return $this->success($sale->load(['store', 'customer', 'cashier', 'items.product']), 'Sale updated successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Sale $sale)
    {
        try {
            // Restore product quantities
            foreach ($sale->items as $item) {
                $product = Product::find($item->product_id);
                if ($product) {
                    $product->increment('quantity', $item->quantity);
                }
            }

            $sale->delete();
            return $this->success(null, 'Sale deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}