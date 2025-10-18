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
import { Package, DollarSign, AlertTriangle, TrendingUp, Plus, Grid3X3, Table } from 'lucide-react';

// Animation variants for stats cards
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};


const numberVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      delay: 0.3,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const iconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

// Enhanced Stats Cards Component
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
  const stats = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Package,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950",
      borderColor: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-700 dark:text-blue-300",
      iconBg: "bg-blue-500",
      gradient: "bg-gradient-to-br from-blue-500 to-cyan-500"
    },
    {
      title: "Total Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950",
      borderColor: "border-green-200 dark:border-green-800",
      textColor: "text-green-700 dark:text-green-300",
      iconBg: "bg-green-500",
      gradient: "bg-gradient-to-br from-green-500 to-emerald-500"
    },
    {
      title: "Low Stock",
      value: lowStockProducts,
      icon: AlertTriangle,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950",
      borderColor: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-700 dark:text-orange-300",
      iconBg: "bg-orange-500",
      gradient: "bg-gradient-to-br from-orange-500 to-red-500",
      isAlert: lowStockProducts > 0
    },
    {
      title: "Avg Price",
      value: `$${averagePrice.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950",
      borderColor: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-700 dark:text-purple-300",
      iconBg: "bg-purple-500",
      gradient: "bg-gradient-to-br from-purple-500 to-pink-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="h-full"
        >
          <Card className={`
            h-full border-2 ${stat.borderColor} 
            ${stat.bgColor} 
            shadow-sm hover:shadow-xl 
            transition-all duration-300
            overflow-hidden
            relative
            group
            backdrop-blur-sm
          `}>
            {/* Animated background gradient */}
            <div className={`
              absolute inset-0 bg-gradient-to-br ${stat.color} 
              opacity-0 group-hover:opacity-5 
              transition-opacity duration-500
            `} />
            
            {/* Pulse animation for alert cards */}
            {stat.isAlert && (
              <motion.div
                className="absolute top-2 right-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              </motion.div>
            )}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className={`text-sm font-semibold ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <motion.div
                variants={iconVariants}
                initial="hidden"
                animate="visible"
                className={`
                  p-2 rounded-lg ${stat.iconBg} 
                  shadow-lg group-hover:shadow-xl
                  transition-all duration-300
                `}
              >
                <stat.icon className="h-4 w-4 text-white" />
              </motion.div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <motion.div
                variants={numberVariants}
                initial="hidden"
                animate="visible"
                className={`
                  text-3xl font-bold ${stat.textColor}
                  tracking-tight
                `}
              >
                {stat.value}
              </motion.div>
              
              {/* Progress bar for low stock indicator */}
              {stat.title === "Low Stock" && lowStockProducts > 0 && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="mt-2 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                />
              )}
              
              {/* Subtle trend indicator for average price */}
              {stat.title === "Avg Price" && averagePrice > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-1 mt-1"
                >
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-muted-foreground">
                    Market average
                  </span>
                </motion.div>
              )}
            </CardContent>
          </Card>
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

        {/* Enhanced Stats Cards */}
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