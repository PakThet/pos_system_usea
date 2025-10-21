'use client';

import ProductHeader from "@/components/products/PageHeader";
import ProductFilters from "@/components/products/ProductFilters";
import ProductTable from "@/components/products/ProductTable";
import { useProducts } from "@/hooks/useProducts";

export default function ProductsPage() {
  const {
    products,
    filteredProducts,
    searchTerm,
    setSearchTerm,
    filters,
    setFilters,
    loading,
  } = useProducts();
const categories = Array.from(new Set(products.map((p) => p.cate))).filter(Boolean);

  const resetFilters = () => {
    setFilters({ cate: 'all', inStock: 'all' });
    setSearchTerm('');
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p>Loading products...</p>
      </div>
    );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ProductHeader onAdd={() => console.log('Open Add Product Dialog')} />
       <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        categories={categories}
      />
      <ProductTable
        products={products}
        filtered={filteredProducts}
        onEdit={(p) => console.log('Edit', p)}
        onDelete={(p) => console.log('Delete', p)}
      />
    </div>
  );
}
