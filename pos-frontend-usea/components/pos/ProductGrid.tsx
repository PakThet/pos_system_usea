// components/pos/product-grid.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { Package, AlertCircle } from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  searchQuery: string;
}

export function ProductGrid({ products, onProductSelect, searchQuery }: ProductGridProps) {
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.barcode.includes(searchQuery)
  );

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <Package className="w-16 h-16 mb-4" />
        <p>No products found</p>
        <p className="text-sm">Try adjusting your search</p>
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-3 gap-4 overflow-y-auto">
      {filteredProducts.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onProductSelect(product)}
        >
          <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{product.sku}</p>
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">
              KSh {parseFloat(product.price).toLocaleString()}
            </span>
            {product.quantity <= product.quantity_alert && (
              <AlertCircle className="w-4 h-4 text-orange-500" />
            )}
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            Stock: {product.quantity}
          </div>
        </motion.div>
      ))}
    </div>
  );
}