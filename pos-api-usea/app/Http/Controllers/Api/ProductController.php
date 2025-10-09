<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $products = Product::with(['store', 'category'])->get();

            // Convert image path to full URL
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image = asset('storage/' . $product->image);
                }
                return $product;
            });

            return response()->json([
                "success" => true,
                "message" => "Products fetched successfully",
                "data" => $products,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'store_id'       => 'required|exists:stores,id',
                'category_id'    => 'required|exists:categories,id',
                'p_name'         => 'required|string|max:255',
                'description'    => 'nullable|string',
                'sku'            => 'required|string|max:100|unique:products',
                'slug'           => 'required|string|max:150|unique:products',
                'barcode'        => 'required|string|max:150|unique:products',
                'price'          => 'required|numeric',
                'tax'            => 'required|numeric',
                'stock'          => 'required|integer',
                'quantity'       => 'required|integer',
                'discount'       => 'nullable|numeric',
                'quantity_alert' => 'required|integer',
            ]);

            if ($request->hasFile('image')) {
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            $product = Product::create($validated);

            // Convert image path to full URL
            if ($product->image) {
                $product->image = asset('storage/' . $product->image);
            }

            return response()->json([
                "success" => true,
                "message" => "Product created successfully",
                "data" => $product,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        try {
            $product->load(['store', 'category']);
            if ($product->image) {
                $product->image = asset('storage/' . $product->image);
            }

            return response()->json([
                "success" => true,
                "message" => "Product fetched successfully",
                "data" => $product,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 501);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'store_id'       => 'sometimes|exists:stores,id',
                'category_id'    => 'sometimes|exists:categories,id',
                'p_name'         => 'sometimes|string|max:255',
                'description'    => 'nullable|string',
                'sku'            => 'sometimes|string|max:100|unique:products,sku,' . $product->id,
                'slug'           => 'sometimes|string|max:150|unique:products,slug,' . $product->id,
                'barcode'        => 'sometimes|string|max:150|unique:products,barcode,' . $product->id,
                'price'          => 'sometimes|numeric',
                'tax'            => 'sometimes|numeric',
                'stock'          => 'sometimes|integer',
                'quantity'       => 'sometimes|integer',
                'discount'       => 'nullable|numeric',
                'quantity_alert' => 'sometimes|integer',
            ]);

            if ($request->hasFile('image')) {
                if ($product->image) {
                    // Remove old file
                    $oldPath = str_replace(asset('storage/') . '/', '', $product->image);
                    Storage::disk('public')->delete($oldPath);
                }
                $validated['image'] = $request->file('image')->store('products', 'public');
            }

            $product->update($validated);

            if ($product->image) {
                $product->image = asset('storage/' . $product->image);
            }

            return response()->json([
                "success" => true,
                "message" => "Product updated successfully",
                "data" => $product,
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 501);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            if ($product->image) {
                $oldPath = str_replace(asset('storage/') . '/', '', $product->image);
                Storage::disk('public')->delete($oldPath);
            }
            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ]);
        }
    }
}
