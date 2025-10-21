'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { api } from "@/lib/api"; 
import { Category, CreateCategoryData, UpdateCategoryData } from "@/types/category";
import { CategoryForm } from "@/components/categories/category-form";
import { CategoriesGrid } from "@/components/categories/categories-grid";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data.data);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleCreateCategory = async (data: CreateCategoryData) => {
    setIsLoading(true);
    try {
      const res = await api.post("/categories", data);
      setCategories((prev) => [...prev, res.data]);
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create category", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async (data: UpdateCategoryData) => {
    if (!editingCategory) return;
    setIsLoading(true);
    try {
      const res = await api.put(`/categories/${editingCategory.id}`, data);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? res.data : cat))
      );
      setEditingCategory(null);
    } catch (err) {
      console.error("Failed to update category", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;
    try {
      await api.delete(`/categories/${category.id}`);
      setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
    } catch (err) {
      console.error("Failed to delete category", err);
    }
  };

  const handleEdit = (category: Category) => setEditingCategory(category);
  const handleCancel = () => { setShowForm(false); setEditingCategory(null); };

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage your product categories</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Form */}
      {(showForm || editingCategory) && (
        <CategoryForm
          category={editingCategory || undefined}
          onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      )}

      {/* Grid */}
      <CategoriesGrid
        categories={filteredCategories}
        onEdit={handleEdit}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}
