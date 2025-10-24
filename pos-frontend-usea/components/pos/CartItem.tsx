// components/pos/CartItem.tsx
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from '@/types/pos';
import { formatCurrency } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const { product, quantity, unitPrice, total } = item;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow"
    >
      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-md overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-xs text-gray-500">No image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">{product.name}</h4>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(unitPrice)} × {quantity}
        </p>
        <p className="text-sm font-semibold text-green-600">
          {formatCurrency(total)}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        
        <span className="text-sm w-8 text-center font-medium">{quantity}</span>
        
        <Button
          size="sm"
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
        
        <Button
          size="sm"
          variant="destructive"
          className="h-8 w-8 p-0"
          onClick={() => onRemove(product.id)}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};