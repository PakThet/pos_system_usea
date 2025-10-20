// app/pos/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Scan, User, ShoppingCart, CreditCard, Package } from 'lucide-react';
import { usePOS } from '@/hooks/use-pos';
import { SearchBar } from '@/components/pos/search-bar';
import { ProductGrid } from '@/components/pos/ProductGrid';
import { CustomerPanel } from '@/components/pos/customer-panel';
import { CartPanel } from '@/components/pos/cart-panel';
import { PaymentPanel } from '@/components/pos/payment-panel';

export default function POSPage() {
  const {
    cart,
    customer,
    cashier,
    products,
    searchQuery,
    setSearchQuery,
    addToCart,
    removeFromCart,
    updateQuantity,
    setCustomer,
    processPayment,
    clearCart,
    subtotal,
    tax,
    discount,
    total
  } = usePOS();

  const [activeTab, setActiveTab] = useState<'products' | 'cart' | 'payment'>('products');

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Products */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
              <p className="text-sm text-gray-600">Main Store - Nairobi</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Cashier</p>
                <p className="font-semibold">John Mwangi</p>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                JM
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 bg-white border-b">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onBarcodeScan={() => {/* Implement barcode scan */}}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-hidden">
          <ProductGrid
            products={products}
            onProductSelect={addToCart}
            searchQuery={searchQuery}
          />
        </div>
      </div>

      {/* Right Panel - Cart & Payment */}
      <div className="w-96 bg-white border-l flex flex-col">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'products'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <Package className="w-4 h-4 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'cart'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Cart ({cart.length})
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === 'payment'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            <CreditCard className="w-4 h-4 inline mr-2" />
            Payment
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <CustomerPanel
                  customer={customer}
                  onCustomerSelect={setCustomer}
                  onCustomerClear={() => setCustomer(null)}
                />
              </motion.div>
            )}

            {activeTab === 'cart' && (
              <motion.div
                key="cart"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <CartPanel
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  subtotal={subtotal}
                  tax={tax}
                  discount={discount}
                  total={total}
                  customer={customer}
                />
              </motion.div>
            )}

            {activeTab === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <PaymentPanel
                  total={total}
                  customer={customer}
                  onPaymentComplete={processPayment}
                  onCancel={clearCart}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}