<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\CustomerAddress;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Order::with([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by payment status
            if ($request->has('payment_status')) {
                $query->where('payment_status', $request->payment_status);
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

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('order_number', 'like', "%{$search}%")
                      ->orWhereHas('customer', function ($q) use ($search) {
                          $q->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%");
                      });
                });
            }

            // Pagination
            $perPage = $request->get('per_page', 15);
            $orders = $query->orderBy('created_at', 'desc')->paginate($perPage);
            $orders->getCollection()->transform(function ($order) {
    foreach ($order->items as $item) {
        if ($item->product) {
            $item->product->image = $item->product->image_url; 
        }
    }
    return $order;
});
            return response()->json([
                "success" => true,
                "message" => "Orders fetched successfully",
                "data" => $orders,
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
                'customer_id' => 'required|exists:customers,id',
                'cashier_id' => 'required|exists:users,id',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|exists:products,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'shipping_address' => 'required|array',
                'shipping_address.street' => 'required|string',
                'shipping_address.city' => 'required|string',
                'shipping_address.state' => 'required|string',
                'shipping_address.zip_code' => 'required|string',
                'shipping_address.country' => 'required|string',
                'billing_address' => 'sometimes|array',
                'billing_address.street' => 'required_with:billing_address|string',
                'billing_address.city' => 'required_with:billing_address|string',
                'billing_address.state' => 'required_with:billing_address|string',
                'billing_address.zip_code' => 'required_with:billing_address|string',
                'billing_address.country' => 'required_with:billing_address|string',
                'subtotal_amount' => 'required|numeric|min:0',
                'tax_amount' => 'required|numeric|min:0',
                'shipping_amount' => 'required|numeric|min:0',
                'discount_amount' => 'required|numeric|min:0',
                'total_amount' => 'required|numeric|min:0',
            ]);

            // Create addresses
            $shippingAddress = CustomerAddress::create([
                'customer_id' => $validated['customer_id'],
                'street' => $validated['shipping_address']['street'],
                'city' => $validated['shipping_address']['city'],
                'state' => $validated['shipping_address']['state'],
                'zip_code' => $validated['shipping_address']['zip_code'],
                'country' => $validated['shipping_address']['country'],
                'type' => 'shipping',
                'is_default' => false,
            ]);

            $billingAddress = CustomerAddress::create([
                'customer_id' => $validated['customer_id'],
                'street' => $validated['billing_address']['street'] ?? $validated['shipping_address']['street'],
                'city' => $validated['billing_address']['city'] ?? $validated['shipping_address']['city'],
                'state' => $validated['billing_address']['state'] ?? $validated['shipping_address']['state'],
                'zip_code' => $validated['billing_address']['zip_code'] ?? $validated['shipping_address']['zip_code'],
                'country' => $validated['billing_address']['country'] ?? $validated['shipping_address']['country'],
                'type' => 'billing',
                'is_default' => false,
            ]);

            // Create order
            $order = Order::create([
                'store_id' => 1, // You might want to get this from the cashier's store
                'customer_id' => $validated['customer_id'],
                'cashier_id' => $validated['cashier_id'],
                'shipping_address_id' => $shippingAddress->id,
                'billing_address_id' => $billingAddress->id,
                'subtotal_amount' => $validated['subtotal_amount'],
                'tax_amount' => $validated['tax_amount'],
                'shipping_amount' => $validated['shipping_amount'],
                'discount_amount' => $validated['discount_amount'],
                'total_amount' => $validated['total_amount'],
                'status' => 'pending',
                'payment_status' => 'pending',
            ]);

            // Create order items and update product quantities
            foreach ($validated['items'] as $itemData) {
                $product = Product::find($itemData['product_id']);
                
                // Create order item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'product_name' => $product->name,
                    'price' => $itemData['price'],
                    'quantity' => $itemData['quantity'],
                    'total_price' => $itemData['price'] * $itemData['quantity'],
                ]);

                // Update product quantity
                $product->decrement('quantity', $itemData['quantity']);
            }

            // Update customer stats
            $customer = \App\Models\Customer::find($validated['customer_id']);
            $customer->increment('total_orders');
            $customer->increment('total_spent', $validated['total_amount']);
            $customer->update(['last_order_at' => now()]);

            DB::commit();

            $order->load([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]);

            return response()->json([
                "success" => true,
                "message" => "Order created successfully",
                "data" => $order,
            ], 201);
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function show(Order $order)
    {
        try {
            $order->load([
                'store', 
                'customer', 
                'cashier', 
                'items.product',
                'shippingAddress',
                'billingAddress'
            ]);
            
$order->items->each(function ($item) {
                if ($item->product) {
                    $item->product->image = $item->product->image_url;
                }
            });
            return response()->json([
                "success" => true,
                "message" => "Order fetched successfully",
                "data" => $order,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updateStatus(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'status' => 'required|in:pending,confirmed,processing,shipped,delivered,cancelled',
            ]);

            $order->update(['status' => $validated['status']]);

            return response()->json([
                "success" => true,
                "message" => "Order status updated successfully",
                "data" => $order,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function updatePaymentStatus(Request $request, Order $order)
    {
        try {
            $validated = $request->validate([
                'payment_status' => 'required|in:pending,paid,failed,refunded',
            ]);

            $order->update(['payment_status' => $validated['payment_status']]);

            return response()->json([
                "success" => true,
                "message" => "Order payment status updated successfully",
                "data" => $order,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function stats()
    {
        try {
            $stats = [
                'total' => Order::count(),
                'pending' => Order::where('status', 'pending')->count(),
                'confirmed' => Order::where('status', 'confirmed')->count(),
                'processing' => Order::where('status', 'processing')->count(),
                'shipped' => Order::where('status', 'shipped')->count(),
                'delivered' => Order::where('status', 'delivered')->count(),
                'cancelled' => Order::where('status', 'cancelled')->count(),
                'total_revenue' => Order::where('payment_status', 'paid')->sum('total_amount'),
                'total_tax' => Order::where('payment_status', 'paid')->sum('tax_amount'),
                'average_order_value' => Order::where('payment_status', 'paid')->avg('total_amount'),
            ];

            return response()->json([
                "success" => true,
                "message" => "Order stats fetched successfully",
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