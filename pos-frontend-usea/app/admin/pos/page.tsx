// app/admin/pos/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Search } from "lucide-react";
import { posApi } from '@/services/posApi';
import { useAuthStore } from '@/types/auth';
import { Product, Customer, CartItem, PaymentMethod } from '@/types/pos';
import { ProductCard } from '@/components/pos/ProductCard';
import { CartItem as CartItemComponent } from '@/components/pos/CartItem';
import { CustomerSearch } from '@/components/pos/CustomerSearch';
import { BarcodeScanner } from '@/components/pos/BarcodeScanner';
import { PaymentSection } from '@/components/pos/PaymentSection';
import { formatCurrency } from '@/lib/utils';

export default function POSPage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [productsResponse, customersResponse] = await Promise.all([
        posApi.getProducts(),
        posApi.getCustomers()
      ]);
      
      setProducts(productsResponse.data);
      setCustomers(customersResponse.data.data);
    } catch (error) {
      console.error('Failed to load initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    if (product.quantity <= 0) {
      alert('Product out of stock');
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity > product.quantity) {
          alert('Not enough stock available');
          return prevCart;
        }
        
        return prevCart.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: newQuantity,
                total: newQuantity * item.unitPrice,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          product,
          quantity: 1,
          unitPrice: parseFloat(product.price),
          taxRate: parseFloat(product.tax_rate),
          discount: 0,
          total: parseFloat(product.price),
        },
      ];
    });
  };

  const handleBarcodeSearch = () => {
    if (!barcodeInput.trim()) return;
    
    const product = products.find(p => 
      p.sku.toLowerCase() === barcodeInput.toLowerCase() ||
      p.name.toLowerCase().includes(barcodeInput.toLowerCase())
    );
    
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      alert('Product not found');
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
      alert('Not enough stock available');
      return;
    }

    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              total: quantity * item.unitPrice,
            }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const totalAmount = subtotal + taxAmount;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Please add items to cart');
      return;
    }

    try {
      const saleData = {
        customer_id: selectedCustomer?.id || null,
        cashier_id: user?.id,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          tax_rate: item.taxRate,
          discount_amount: item.discount,
        })),
        subtotal_amount: subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
      };

      await posApi.createSale(saleData);
      
      clearCart();
      alert('Sale completed successfully!');
    } catch (error: any) {
      console.error('Checkout failed:', error);
      alert(error.response?.data?.message || 'Checkout failed. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading POS System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-6">
          <BarcodeScanner
            barcodeInput={barcodeInput}
            onBarcodeInputChange={setBarcodeInput}
            onBarcodeSearch={handleBarcodeSearch}
            products={products}
          />

          {/* Products Grid */}
          <Card>
            <CardHeader>
              <CardTitle>Products ({products.length})</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products by name, SKU, or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-2">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                    />
                  ))}
                </AnimatePresence>
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No products found</p>
                    <p className="text-sm">Try adjusting your search terms</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="space-y-6">
          <CustomerSearch
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={setSelectedCustomer}
            isOpen={showCustomerSearch}
            onClose={() => setShowCustomerSearch(!showCustomerSearch)}
          />

          {/* Cart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Cart ({cart.length})
                {cart.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCart}
                    className="ml-auto"
                  >
                    Clear All
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                <AnimatePresence>
                  {cart.map((item) => (
                    <CartItemComponent
                      key={item.product.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                    />
                  ))}
                </AnimatePresence>
                
                {cart.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Your cart is empty</p>
                    <p className="text-sm">Add products to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <PaymentSection
            cart={cart}
            paymentMethod={paymentMethod}
            onPaymentMethodChange={setPaymentMethod}
            onCheckout={handleCheckout}
            subtotal={subtotal}
            taxAmount={taxAmount}
            totalAmount={totalAmount}
          />
        </div>
      </div>
    </div>
  );
}