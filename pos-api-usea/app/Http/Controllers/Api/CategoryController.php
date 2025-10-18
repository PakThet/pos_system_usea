<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Exception;
use Illuminate\Http\Request;

class CategoryController extends ApiController
{
    public function index()
    {
        try {
            $categories = Category::all(); 
            return $this->success($categories, 'Categories fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'slug' => 'required|string|unique:categories,slug',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive',
            ]);

            $category = Category::create($validated);
            return $this->success($category, 'Category created successfully'); // removed load('store')
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function show(Category $category)
    {
        try {
            $category->load('products'); // only load products
            return $this->success($category, 'Category fetched successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function update(Request $request, Category $category)
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'slug' => 'sometimes|string|unique:categories,slug,' . $category->id,
                'description' => 'nullable|string',
                'status' => 'sometimes|in:active,inactive',
            ]);

            $category->update($validated);
            return $this->success($category, 'Category updated successfully'); // removed load('store')
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }

    public function destroy(Category $category)
    {
        try {
            if ($category->products()->exists()) {
                return $this->error('Cannot delete category with associated products', 422);
            }

            $category->delete();
            return $this->success(null, 'Category deleted successfully');
        } catch (Exception $e) {
            return $this->error($e->getMessage());
        }
    }
}
