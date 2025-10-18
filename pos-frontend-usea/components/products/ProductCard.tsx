import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { Edit, Trash2, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onAddToCart,
}) => {
  const isLowStock = product.quantity <= product.quantity_alert;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full flex flex-col">
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start mb-2">
            <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
              {product.status}
            </Badge>
            <Badge variant={isLowStock ? 'destructive' : 'outline'}>
              {product.quantity} in stock
            </Badge>
          </div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg mb-3"
          />
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 truncate">{product.sku}</p>
        </CardHeader>
        
        <CardContent className="p-4 pt-0 flex-grow">
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-lg">${parseFloat(product.price).toLocaleString()}</p>
            <p className="text-gray-600">Cost: ${parseFloat(product.cost_price).toLocaleString()}</p>
            <p className="text-gray-600">Tax: {product.tax_rate}%</p>
            <p className="text-gray-600">Category: {product.category.name}</p>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 pt-2">
          <div className="flex justify-between w-full space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(product)}
              className="flex-1"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};