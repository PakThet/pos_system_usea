'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/types/pos';

interface CartPanelProps {
  cart: CartItem[];
onUpdateQuantity: (productId: number, quantity: number) => void; // <-- number
  onRemoveItem: (productId: number) => void; // <-- string
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customer: Customer | null;
}

export function CartPanel({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  subtotal,
  tax,
  discount,
  total,
  customer
}: CartPanelProps) {
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <ShoppingCart className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="text-sm text-center mt-2">
          Start adding products to see them here
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence>
          {cart.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border rounded-lg p-3 mb-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{item.product.name}</h4>
                  <p className="text-xs text-gray-600">{item.product.sku}</p>
                  <p className="text-sm font-medium mt-1">
                    KSh {item.product.price?.toLocaleString()} × {item.quantity}
                  </p>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                    }
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Minus className="w-3 h-3" />
                  </button>

                  <span className="w-8 text-center font-medium">{item.quantity}</span>

                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <span className="font-bold">
                  KSh {item.total?.toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Summary */}
      <div className="border-t p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>KSh {tax.toLocaleString()}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-KSh {discount.toLocaleString()}</span>
          </div>
        )}

        <div className="border-t pt-2 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>KSh {total.toLocaleString()}</span>
        </div>

        {customer && (
          <div className="text-xs text-gray-600 mt-2">
            Customer: {customer.first_name} {customer.last_name}
          </div>
        )}

        <Button className="w-full mt-4" size="lg">
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
