'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CartItem, Customer } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartSidebarProps {
  cart: CartItem[];
  selectedCustomer: Customer | null;
  subtotal: number;
  tax: number;
  total: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({
  cart,
  selectedCustomer,
  subtotal,
  tax,
  total,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}: CartSidebarProps) {
  return (
    <motion.div 
      className="w-96 bg-white border-l border-gray-200 flex flex-col"
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
    >
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          <span>Cart ({cart.length})</span>
          {cart.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearCart}>
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
        
        {selectedCustomer && (
          <div className="text-sm text-gray-600">
            Customer: {selectedCustomer.first_name} {selectedCustomer.last_name}
            <Badge variant="outline" className="ml-2">
              {selectedCustomer.tier}
            </Badge>
          </div>
        )}
      </CardHeader>

      <ScrollArea className="flex-1 p-4">
        <AnimatePresence>
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add products to get started</p>
            </div>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 last:mb-0"
              >
                <Card>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{item.product.name}</h4>
                        <p className="text-xs text-gray-500">
                          KSh {parseFloat(item.product.price).toLocaleString()} × {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-green-600">
                          KSh {(parseFloat(item.product.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-red-500"
                          onClick={() => onRemoveFromCart(item.product.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </ScrollArea>

      {cart.length > 0 && (
        <Card className="m-4 mt-auto">
          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax:</span>
              <span>KSh {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span className="text-green-600">KSh {total.toLocaleString()}</span>
            </div>
            
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={onCheckout}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Checkout
            </Button>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}