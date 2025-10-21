<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Sale::with(['store', 'customer', 'cashier', 'items.product']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by payment method
            if ($request->has('payment_method')) {
                $query->where('payment_method', $request->payment_method);
            }

            // Filter by date range
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Filter by store
            if ($request->has('store_id')) {
                $query->where('store_id', $request->store_id);
            }

            // Filter by cashier
            if ($request->has('cashier_id')) {
                $query->where('cashier_id', $request->cashier_id);
            }

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('transaction_id', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                      });
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $sales = $query->orderBy('created_at', 'desc')->paginate($perPage);

            return response()->json([
                "success" => true,
                "message" => "Sales fetched successfully",
                "data" => $sales,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $validated = $request->validate([
                'customer_id' => 'nullable|exists:customers,id',
                'cashier_id' => 'required|exists:users,id',
                'payment_method' => 'required|in:card,cash,mobile,credit',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'items.*.tax_rate' => 'required|numeric|min:0|max:100',
                'items.*.discount_amount' => 'required|numeric|min:0',
                'subtotal_amount' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
                'notes' => 'nullable|string',
            ]);

            // Create sale
            $sale = Sale::create([
                'store_id' => 1, // You might want to get this from the cashier's store
                'customer_id' => $validated['customer_id'] ?? null,
                'cashier_id' => $validated['cashier_id'],
                'payment_method' => $validated['payment_method'],
                'subtotal_amount' => $validated['subtotal_amount'],
                'tax_amount' => $validated['tax_amount'],
                'discount_amount' => $validated['discount_amount'],
                'total_amount' => $validated['total_amount'],
                'status' => 'completed',
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create sale items and update product quantities
            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                
                // Create sale item
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $itemData['product_id'],
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'category_name' => $product->category->name,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'tax_rate' => $itemData['tax_rate'],
                    'discount_amount' => $itemData['discount_amount'],
                    'total_price' => ($itemData['unit_price'] * $itemData['quantity']) - $itemData['discount_amount'],
                ]);

                // Update product quantity
                $product->decrement('quantity', $itemData['quantity']);
            }

            // Update customer stats if customer exists
            if ($validated['customer_id']) {
                $customer = \App\Models\Customer::find($validated['customer_id']);
                $customer->increment('total_orders');
                $customer->increment('total_spent', $validated['total_amount']);
                $customer->update(['last_order_at' => now()]);
            }

            // Update cashier stats
            $cashier = \App\Models\User::find($validated['cashier_id']);
            $cashier->increment('total_transactions');
            $cashier->increment('total_sales', $validated['total_amount']);

            DB::commit();

            $sale->load(['store', 'customer', 'cashier', 'items.product']);

            return response()->json([
                "success" => true,
                "message" => "Sale created successfully",
                "data" => $sale,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Sale $sale)
    {
        try {
            $sale->load(['store', 'customer', 'cashier', 'items.product']);

            return response()->json([
                "success" => true,
                "message" => "Sale fetched successfully",
                "data" => $sale,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, Sale $sale)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:completed,pending,cancelled,refunded',
            ]);

            $sale->update(['status' => $validated['status']]);

            return response()->json([
                "success" => true,
                "message" => "Sale status updated successfully",
                "data" => $sale,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function stats(Request $request)
    {
        try {
            $query = Sale::query();

            // Filter by date range
            if ($request->has('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            $stats = [
                'total_sales' => $query->count(),
                'total_revenue' => $query->sum('total_amount'),
                'total_tax' => $query->sum('tax_amount'),
                'total_discount' => $query->sum('discount_amount'),
                'average_sale_value' => $query->avg('total_amount'),
                'status_breakdown' => [
                    'completed' => Sale::where('status', 'completed')->count(),
                    'pending' => Sale::where('status', 'pending')->count(),
                    'cancelled' => Sale::where('status', 'cancelled')->count(),
                    'refunded' => Sale::where('status', 'refunded')->count(),
                ],
                'payment_method_breakdown' => [
                    'card' => Sale::where('payment_method', 'card')->count(),
                    'cash' => Sale::where('payment_method', 'cash')->count(),
                    'mobile' => Sale::where('payment_method', 'mobile')->count(),
                    'credit' => Sale::where('payment_method', 'credit')->count(),
                ],
            ];

            return response()->json([
                "success" => true,
                "message" => "Sales stats fetched successfully",
                "data" => $stats,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}