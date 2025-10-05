"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Category, CreateCategoryData, UpdateCategoryData } from "@/types/category";
import { CategoriesGrid } from "@/components/categories-grid";
import { CategoryForm } from "@/components/category-form";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";
const api = process.env.NEXT_PUBLIC_API_BASE_URL;
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    desc: "Electronic devices and accessories",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "Clothing",
    slug: "clothing",
    desc: "Fashion and apparel",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    name: "Books",
    slug: "books",
    desc: "Various books and literature",
    status: "inactive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
const [refreshFlag, setRefreshFlag] = useState(0);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!USE_API) {
        const filtered = mockCategories.filter((category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.desc?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setCategories(filtered);
      } else {
        try {
          const res = await fetch(`${api}/categories${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`);
          const data = await res.json();
          setCategories(data.data);
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      }
    };

    fetchCategories();
  }, [searchTerm, refreshFlag]);


  const handleCreateCategory = async (data: CreateCategoryData) => {
    setIsLoading(true);

    if (!USE_API) {
      const newCategory: Category = {
        id: Date.now().toString(),
        ...data,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCategories((prev) => [...prev, newCategory]);
    } else {
      try {
        const res = await fetch(`${api}/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const newCategory = await res.json();
        
        setCategories((prev) => [...prev, newCategory]);

        setRefreshFlag(prev => prev + 1);

      } catch (err) {
        console.error("Failed to create category", err);
      }
    }

    setShowForm(false);
    setIsLoading(false);
  };


  const handleUpdateCategory = async (data: UpdateCategoryData) => {
    if (!editingCategory) return;
    setIsLoading(true);

    if (!USE_API) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id
            ? { ...cat, ...data, updatedAt: new Date() }
            : cat
        )
      );
    } else {
      try {
        const res = await fetch(`${api}/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const updated = await res.json();
        setCategories((prev) =>
          prev.map((cat) => (cat.id === updated.id ? updated : cat))
        );
        setRefreshFlag(prev => prev + 1);
      } catch (err) {
        console.error("Failed to update category", err);
      }
    }

    setEditingCategory(null);
    setIsLoading(false);
  };


  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    if (!USE_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
    } else {
      try {
        await fetch(`${api}/categories/${category.id}`, {
          method: "DELETE",
        });
        setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };


  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Form Card */}
      {(showForm || editingCategory) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCategory ? "Edit Category" : "Create New Category"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              category={editingCategory || undefined}
              onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      )}

      {/* Categories Grid */}
      <CategoriesGrid
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDeleteCategory}
      />
    </div>
  );
}