"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Category, CreateCategoryData, UpdateCategoryData } from "@/types/category";
import { CategoriesGrid } from "@/components/categories/categories-grid";
import { CategoryForm } from "@/components/categories/category-form";
import { categoryApi } from "@/services/categoryApi";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

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

// Transform API category to app category
const transformApiCategory = (apiCategory: any): Category => ({
  id: apiCategory.id.toString(),
  name: apiCategory.name,
  slug: apiCategory.slug,
  desc: apiCategory.desc || "",
  status: apiCategory.status,
  createdAt: new Date(apiCategory.created_at),
  updatedAt: new Date(apiCategory.updated_at),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          setIsLoading(true);
          const response = await categoryApi.getCategories();
          
          if (response.success && Array.isArray(response.data)) {
            const transformedCategories = response.data.map(transformApiCategory);
            
            // Filter by search term if provided
            const filtered = searchTerm 
              ? transformedCategories.filter((category) =>
                  category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  category.desc?.toLowerCase().includes(searchTerm.toLowerCase())
                )
              : transformedCategories;
            
            setCategories(filtered);
          } else {
            console.error("Invalid API response structure", response);
            setCategories([]);
          }
        } catch (err) {
          console.error("Failed to fetch categories", err);
          setCategories([]);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCategories();
  }, [searchTerm]);

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
      setShowForm(false);
    } else {
      try {
        const response = await categoryApi.createCategory({
          name: data.name,
          slug: data.slug,
          desc: data.desc
        });
        
        if (response.success) {
          const newCategory = transformApiCategory(response.data);
          setCategories((prev) => [...prev, newCategory]);
          setShowForm(false);
        } else {
          console.error("Failed to create category", response.message);
          alert(`Failed to create category: ${response.message}`);
        }
      } catch (err) {
        console.error("Failed to create category", err);
        alert("Failed to create category. Please try again.");
      }
    }

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
      setEditingCategory(null);
    } else {
      try {
        const response = await categoryApi.updateCategory(editingCategory.id, {
          name: data.name,
          slug: data.slug,
          desc: data.desc,
          status: data.status,
        });
        
        if (response.success) {
          const updatedCategory = transformApiCategory(response.data);
          setCategories((prev) =>
            prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
          );
          setEditingCategory(null);
        } else {
          console.error("Failed to update category", response.message);
          alert(`Failed to update category: ${response.message}`);
        }
      } catch (err) {
        console.error("Failed to update category", err);
        alert("Failed to update category. Please try again.");
      }
    }

    setIsLoading(false);
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    if (!USE_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
    } else {
      try {
        const response = await categoryApi.deleteCategory(category.id);
        
        if (response.success) {
          setCategories((prev) => prev.filter((cat) => cat.id !== category.id));
        } else {
          console.error("Failed to delete category", response.message);
          alert(`Failed to delete category: ${response.message}`);
        }
      } catch (err) {
        console.error("Failed to delete category", err);
        alert("Failed to delete category. Please try again.");
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}

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