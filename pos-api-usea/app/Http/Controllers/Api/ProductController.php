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
                    $product->image = $this->getImageUrl($product->image);
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
                'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'store_id'       => 'required|exists:stores,id',
                'category_id'    => 'required|exists:categories,id',
                'name'           => 'required|string|max:255',
                'description'    => 'nullable|string',
                'sku'            => 'required|string|max:100|unique:products',
                'slug'           => 'required|string|max:150|unique:products',
                'barcode'        => 'required|string|max:150|unique:products',
                'price'          => 'required|numeric|min:0',
                'cost_price'     => 'nullable|numeric|min:0',
                'tax_rate'       => 'required|numeric|min:0|max:100',
                'quantity'       => 'required|integer|min:0',
                'quantity_alert' => 'required|integer|min:0',
                'status'         => 'sometimes|in:active,inactive',
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                $validated['image'] = $this->storeImage($request->file('image'));
            }

            $product = Product::create($validated);
            $product->load(['store', 'category']);

            // Convert image path to full URL
            if ($product->image) {
                $product->image = $this->getImageUrl($product->image);
            }

            return response()->json([
                "success" => true,
                "message" => "Product created successfully",
                "data" => $product,
            ], 201);
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
            
            // Convert image path to full URL
            if ($product->image) {
                $product->image = $this->getImageUrl($product->image);
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
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        try {
            $validated = $request->validate([
                'image'          => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
                'store_id'       => 'sometimes|exists:stores,id',
                'category_id'    => 'sometimes|exists:categories,id',
                'name'           => 'sometimes|string|max:255',
                'description'    => 'nullable|string',
                'sku'            => 'sometimes|string|max:100|unique:products,sku,' . $product->id,
                'slug'           => 'sometimes|string|max:150|unique:products,slug,' . $product->id,
                'barcode'        => 'sometimes|string|max:150|unique:products,barcode,' . $product->id,
                'price'          => 'sometimes|numeric|min:0',
                'cost_price'     => 'nullable|numeric|min:0',
                'tax_rate'       => 'sometimes|numeric|min:0|max:100',
                'quantity'       => 'sometimes|integer|min:0',
                'quantity_alert' => 'sometimes|integer|min:0',
                'status'         => 'sometimes|in:active,inactive',
            ]);

            // Handle image upload
            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($product->image) {
                    $this->deleteImage($product->image);
                }
                $validated['image'] = $this->storeImage($request->file('image'));
            }

            $product->update($validated);
            $product->load(['store', 'category']);

            // Convert image path to full URL
            if ($product->image) {
                $product->image = $this->getImageUrl($product->image);
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
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        try {
            // Delete associated image
            if ($product->image) {
                $this->deleteImage($product->image);
            }

            $product->delete();

            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get low stock products
     */
    public function lowStock()
    {
        try {
            $products = Product::with(['store', 'category'])
                ->whereRaw('quantity <= quantity_alert')
                ->where('status', 'active')
                ->get();

            // Convert image paths to full URLs
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image = $this->getImageUrl($product->image);
                }
                return $product;
            });

            return response()->json([
                "success" => true,
                "message" => "Low stock products fetched successfully",
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
     * Search products
     */
    public function search(Request $request)
    {
        try {
            $search = $request->get('q');
            
            $products = Product::with(['store', 'category'])
                ->where('name', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%")
                ->orWhere('barcode', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%")
                ->get();

            // Convert image paths to full URLs
            $products->transform(function ($product) {
                if ($product->image) {
                    $product->image = $this->getImageUrl($product->image);
                }
                return $product;
            });

            return response()->json([
                "success" => true,
                "message" => "Products search completed",
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
     * Store image and return path
     */
    private function storeImage($image)
    {
        return $image->store('products', 'public');
    }

    /**
     * Get full image URL
     */
    private function getImageUrl($path)
    {
        return asset('storage/' . $path);
    }

    /**
     * Delete image from storage
     */
    private function deleteImage($path)
    {
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }
    }
}