'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { productApi } from '@/services/productApi';
import { categoryApi } from '@/services/categoryApi';
import { storeApi } from '@/services/storeApi';
import { StatsCards } from '@/components/products/StatsCards';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductsTable } from '@/components/products/ProductTable';
import { ProductsGrid } from '@/components/products/ProductsGrid';
import { Pagination } from '@/components/products/Pagination';
import { PageHeader } from '@/components/products/PageHeader';
import { DeleteConfirmationDialog } from '@/components/products/DeleteConfirmationDialog';
import { ProductViewDialog } from '@/components/products/ProductViewDialog';
import { LoadingState } from '@/components/products/LoadingState';
import { ErrorState } from '@/components/products/ErrorState';
import { ProductFormDialog } from '@/components/products';
import { Category } from '@/types/category';
import { Store } from '@/types/product';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [prevProducts, setPrevProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);

  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch current month products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Current month
      const current = await productApi.getProducts({
        page: currentPage,
        perPage: 12,
        search,
        status: status === 'all' ? undefined : status,
        month: new Date().getMonth() + 1, // send month to API
      });

      // Previous month
      const prev = await productApi.getProducts({
        page: 1,
        perPage: 1000, // fetch all for prev month
        month: new Date().getMonth() === 0 ? 12 : new Date().getMonth(), // previous month
        year: new Date().getMonth() === 0 ? new Date().getFullYear() - 1 : new Date().getFullYear(),
      });

      setProducts(current.data);
      setPrevProducts(prev.data);
      setPagination(current.meta);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories and stores
  const fetchFormData = async () => {
    try {
      const [categoriesRes, storesRes] = await Promise.all([
        categoryApi.getCategories(),
        storeApi.getStores(),
      ]);
      setCategories(categoriesRes.data);
      setStores(storesRes.data);
    } catch (err) {
      console.error('Error fetching form data:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchFormData();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, search, status]);

  // --- CRUD Handlers ---
  const handleCreateProduct = async (formData: FormData) => {
    setFormLoading(true);
    try {
      await productApi.createProduct(formData);
      setIsFormDialogOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Failed to create product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: FormData) => {
    if (!editingProduct) return;
    setFormLoading(true);
    try {
      await productApi.updateProduct(editingProduct.id.toString(), formData);
      setIsFormDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;
    setDeleteLoading(true);
    try {
      await productApi.deleteProduct(deleteProduct.id.toString());
      setIsDeleteDialogOpen(false);
      setDeleteProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Event Handlers ---
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormDialogOpen(true);
  };
  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsFormDialogOpen(true);
  };
  const handleDeleteClick = (product: Product) => {
    setDeleteProduct(product);
    setIsDeleteDialogOpen(true);
  };
  const handleView = (product: Product) => {
    setViewProduct(product);
    setIsViewDialogOpen(true);
  };

  if (error && !products.length) {
    return <ErrorState error={error} onRetry={fetchProducts} />;
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Page Header */}
        <PageHeader viewMode={viewMode} onViewModeChange={setViewMode} onAddProduct={handleAddProduct} />

        {/* Stats Cards */}
        <StatsCards products={products} prevProducts={prevProducts} />

        {/* Filters */}
        <ProductFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} onAddProduct={handleAddProduct} />

        {/* Product List */}
        {loading ? (
          <LoadingState />
        ) : viewMode === 'grid' ? (
          <ProductsGrid products={products} onEdit={handleEdit} onDelete={handleDeleteClick} />
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <ProductsTable products={products} onEdit={handleEdit} onDelete={handleDeleteClick} onView={handleView} />
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Pagination currentPage={currentPage} totalPages={pagination.last_page} onPageChange={setCurrentPage} />
          </motion.div>
        )}
      </motion.div>

      {/* Dialogs */}
      <ProductFormDialog
        open={isFormDialogOpen}
        editingProduct={editingProduct}
        loading={formLoading}
        categories={categories}
        stores={stores}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        onCancel={() => {
          setIsFormDialogOpen(false);
          setEditingProduct(null);
        }}
      />

      <DeleteConfirmationDialog open={isDeleteDialogOpen} product={deleteProduct} loading={deleteLoading} onOpenChange={setIsDeleteDialogOpen} onConfirm={handleDeleteProduct} />

      <ProductViewDialog open={isViewDialogOpen} product={viewProduct} onOpenChange={setIsViewDialogOpen} />
    </div>
  );
}
