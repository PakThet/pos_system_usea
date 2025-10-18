'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProducts } from '@/hooks/useProducts';
import { ProductForm } from '@/components/products/ProductForm';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductsTable } from '@/components/products/ProductTable';
import { ProductFilters } from '@/components/products/ProductFilters';
import { Pagination } from '@/components/products/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Product, CreateProductData } from '@/types/product';
import { productApi } from '@/services/productApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, AlertTriangle, TrendingUp, Plus, Grid3X3, Table, ArrowDownRight, ArrowUpRight } from 'lucide-react';

// KPICard Component
function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
}: {
  title: string
  value: string
  change: number
  icon: any
  description: string
}) {
  const isPositive = change >= 0
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 300 }}>
      <Card className="relative overflow-hidden border-slate-200/50 bg-white/50 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div
            className={`p-2 rounded-lg ${
              isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-2xl font-bold text-slate-900">{value}</div>
          <div className="flex items-center gap-1 mt-1">
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3 text-green-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            <span className="text-xs text-slate-500 ml-1">{description}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Enhanced Stats Cards Component using KPICard
function StatsCards({ 
  totalProducts, 
  totalValue, 
  lowStockProducts, 
  averagePrice 
}: { 
  totalProducts: number;
  totalValue: number;
  lowStockProducts: number;
  averagePrice: number;
}) {
  const kpiCards = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      change: 12, // You can calculate actual change based on previous data
      icon: Package,
      description: "from last month"
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      change: 8, // You can calculate actual change based on previous data
      icon: DollarSign,
      description: "from last month"
    },
    {
      title: "Low Stock",
      value: lowStockProducts.toString(),
      change: -5, // You can calculate actual change based on previous data
      icon: AlertTriangle,
      description: "items need restock"
    },
    {
      title: "Avg Price",
      value: `$${averagePrice.toFixed(2)}`,
      change: 3, // You can calculate actual change based on previous data
      icon: TrendingUp,
      description: "from last month"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpiCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <KPICard {...card} />
        </motion.div>
      ))}
    </div>
  );
}

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);

  const { products, loading: productsLoading, error, pagination, refetch } = useProducts({
    page: currentPage,
    perPage: 12,
    search,
    status: status === 'all' ? undefined : status,
  });

  const handleCreateProduct = async (formData: CreateProductData) => {
    setLoading(true);
    try {
      await productApi.createProduct(formData);
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (formData: CreateProductData) => {
    if (!editingProduct) return;
    
    setLoading(true);
    try {
      await productApi.updateProduct(editingProduct.id.toString(), formData);
      setIsDialogOpen(false);
      setEditingProduct(null);
      refetch();
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;
    
    setLoading(true);
    try {
      await productApi.deleteProduct(deleteProduct.id.toString());
      setDeleteProduct(null);
      refetch();
    } catch (error) {
      console.error('Error deleting product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // Calculate stats
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + parseFloat(product.price) * product.quantity, 0);
  const lowStockProducts = products.filter(product => product.quantity <= product.quantity_alert).length;
  const averagePrice = totalProducts > 0 ? totalValue / totalProducts : 0;

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={refetch} className="mt-4">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Enhanced Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div className="space-y-2">
            <motion.h1 
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Product Management
            </motion.h1>
            <motion.p 
              className="text-gray-600 dark:text-gray-400 text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Manage your product inventory with ease
            </motion.p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Grid3X3 className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="flex items-center gap-2"
              >
                <Table className="h-4 w-4" />
                Table
              </Button>
            </div>
            <Button 
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Cards using KPICard */}
        <StatsCards
          totalProducts={totalProducts}
          totalValue={totalValue}
          lowStockProducts={lowStockProducts}
          averagePrice={averagePrice}
        />

        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          onAddProduct={handleAddProduct}
        />

        {productsLoading ? (
          <motion.div 
            className="flex justify-center items-center h-64"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onEdit={handleEdit}
                  onDelete={setDeleteProduct}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProductsTable
              products={products}
              onEdit={handleEdit}
              onDelete={setDeleteProduct}
              onView={setViewProduct}
            />
          </motion.div>
        )}

        {pagination && pagination.last_page > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.last_page}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </motion.div>

      {/* Dialogs remain the same */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct || undefined}
            onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
            onCancel={() => {
              setIsDialogOpen(false);
              setEditingProduct(null);
            }}
            loading={loading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete <strong>{deleteProduct?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => setDeleteProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewProduct} onOpenChange={() => setViewProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {viewProduct && (
            <div className="space-y-4">
              <img
                src={viewProduct.image}
                alt={viewProduct.name}
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Name</h3>
                  <p>{viewProduct.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">SKU</h3>
                  <p>{viewProduct.sku}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Price</h3>
                  <p>${parseFloat(viewProduct.price).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Quantity</h3>
                  <p>{viewProduct.quantity}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p>{viewProduct.category.name}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p>{viewProduct.status}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p>{viewProduct.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}