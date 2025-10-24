// components/pos/ProductCard.tsx
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { ImageIcon } from "lucide-react";
import { Product } from '@/types/pos';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => {
  const isOutOfStock = product.quantity <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
      className={cn(
        "border rounded-lg p-3 transition-all duration-200 bg-white group",
        isOutOfStock 
          ? "opacity-60 cursor-not-allowed" 
          : "cursor-pointer hover:shadow-md"
      )}
      onClick={() => !isOutOfStock && onAdd(product)}
    >
      <div className="aspect-square rounded-md bg-gray-100 mb-3 overflow-hidden flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-400" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-semibold text-sm leading-tight flex-1 line-clamp-2">
            {product.name}
          </h3>
          <Badge
            variant={isOutOfStock ? 'destructive' : 'secondary'}
            className={cn(
              "text-xs whitespace-nowrap",
              !isOutOfStock && "bg-green-100 text-green-800 hover:bg-green-100"
            )}
          >
            {isOutOfStock ? 'Out of stock' : `${product.quantity} left`}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground capitalize">
          {product.category.name}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-green-600 text-sm">
            {formatCurrency(parseFloat(product.price))}
          </span>
          <span className="text-xs text-muted-foreground font-mono">
            {product.sku}
          </span>
        </div>
      </div>
    </motion.div>
  );
};