'use client';

import { motion } from 'framer-motion';
import { Product } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  index: number;
}

export default function ProductCard({ product, onAddToCart, index }: ProductCardProps) {
  const isLowStock = product.quantity <= product.quantity_alert;
  const isOutOfStock = product.quantity === 0;

  return (
    <motion.div
      variants={{
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
      }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={`overflow-hidden border-2 transition-colors ${
        isOutOfStock 
          ? 'border-gray-200 opacity-50' 
          : 'hover:border-blue-500 border-gray-200'
      }`}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover"
          />
          {isLowStock && !isOutOfStock && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              Low Stock
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="secondary" className="absolute top-2 left-2">
              Out of Stock
            </Badge>
          )}
          <Badge variant="secondary" className="absolute top-2 right-2">
            {product.quantity} left
          </Badge>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{product.name}</h3>
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green-600">
              KSh {parseFloat(product.price).toLocaleString()}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Package className="h-3 w-3 mr-1" />
              {product.sku}
            </div>
          </div>
          
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full"
            size="sm"
            disabled={isOutOfStock}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}