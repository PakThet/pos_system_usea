"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Product, CartItem, Customer, PaymentMethod } from "@/types/pos";
import { ProductGrid } from "@/components/pos/product-grid";
import { CartSummary } from "@/components/pos/cart-summary";
import { PaymentMethods } from "@/components/pos/payment-methods";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, Receipt } from "lucide-react";

// Mock data - replace with actual API calls
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones",
    price: 199.99,
    sku: "WH-001",
    barcode: "123456789012",
    category: "Electronics",
    stock: 25,
    minStock: 5,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    name: "Smartphone Case",
    description: "Protective case for smartphones",
    price: 29.99,
    sku: "SC-001",
    barcode: "123456789013",
    category: "Accessories",
    stock: 100,
    minStock: 10,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    name: "USB-C Cable",
    description: "High-speed charging cable",
    price: 19.99,
    sku: "UC-001",
    barcode: "123456789014",
    category: "Accessories",
    stock: 50,
    minStock: 15,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    name: "Laptop Backpack",
    description: "Water-resistant laptop backpack",
    price: 89.99,
    sku: "LB-001",
    barcode: "123456789015",
    category: "Bags",
    stock: 30,
    minStock: 5,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "5",
    name: "Wireless Mouse",
    description: "Ergonomic wireless mouse",
    price: 39.99,
    sku: "WM-001",
    barcode: "123456789016",
    category: "Electronics",
    stock: 75,
    minStock: 10,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "6",
    name: "Screen Cleaner Kit",
    description: "Complete screen cleaning kit",
    price: 14.99,
    sku: "SCK-001",
    barcode: "123456789017",
    category: "Accessories",
    stock: 200,
    minStock: 25,
    taxRate: 0.08,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const mockCategories = ["All", "Electronics", "Accessories", "Bags"];

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('products');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Calculate cart quantities for product cards
  const cartQuantities = new Map(
    cartItems.map(item => [item.product.id, item.quantity])
  );

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem) {
        // Update quantity
        return prev.map(item =>
          item.product.id === product.id
            ? updateCartItem(item, item.quantity + 1)
            : item
        );
      } else {
        // Add new item
        const newItem: CartItem = {
          id: Math.random().toString(36).substr(2, 9),
          product,
          quantity: 1,
          subtotal: product.price,
          discount: 0,
          tax: product.price * product.taxRate,
          total: product.price * (1 + product.taxRate)
        };
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      
      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity
        return prev.map(item =>
          item.product.id === product.id
            ? updateCartItem(item, item.quantity - 1)
            : item
        );
      } else {
        // Remove item completely
        return prev.filter(item => item.product.id !== product.id);
      }
    });
  };

  const updateCartItemQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? updateCartItem(item, quantity)
          : item
      )
    );
  };

  const updateCartItem = (item: CartItem, quantity: number): CartItem => {
    const subtotal = item.product.price * quantity;
    const tax = subtotal * item.product.taxRate;
    const total = subtotal + tax - item.discount;

    return {
      ...item,
      quantity,
      subtotal,
      tax,
      total
    };
  };

  const removeItemFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    setShowPaymentDialog(true);
    setActiveTab('payment');
  };

  const processPayment = async () => {
    if (!selectedPaymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Here you would typically:
    // 1. Process the payment with your payment gateway
    // 2. Update inventory
    // 3. Save the transaction to your database
    // 4. Print receipt
    
    console.log('Payment processed:', {
      items: cartItems,
      paymentMethod: selectedPaymentMethod,
      total: cartItems.reduce((sum, item) => sum + item.total, 0)
    });
    
    // Reset for next customer
    setCartItems([]);
    setSelectedPaymentMethod(null);
    setShowPaymentDialog(false);
    setActiveTab('products');
    setIsProcessing(false);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-primary">Point of Sale</h1>
              <div className="text-sm text-muted-foreground">
                Cashier: Sarah Johnson • Shift: Morning
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="font-semibold">Total Sales Today</div>
                <div className="text-2xl font-bold text-green-600">$2,847.50</div>
              </div>
              <Button variant="outline">
                <Receipt className="h-4 w-4 mr-2" />
                Transactions
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
          {/* Products Section - 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
            <ProductGrid
              products={mockProducts}
              cartItems={cartQuantities}
              onAddToCart={addToCart}
              onRemoveFromCart={removeFromCart}
              onQuantityChange={(product, quantity) => {
                if (quantity === 0) {
                  removeFromCart(product);
                } else {
                  // Find the cart item and update it
                  const cartItem = cartItems.find(item => item.product.id === product.id);
                  if (cartItem) {
                    updateCartItemQuantity(cartItem.id, quantity);
                  }
                }
              }}
              categories={mockCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>

          {/* Cart Section - 1/3 width */}
          <div className="bg-white rounded-lg border shadow-sm">
            <CartSummary
              items={cartItems}
              onUpdateQuantity={updateCartItemQuantity}
              onRemoveItem={removeItemFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPaymentDialog(false)}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">Complete Payment</h2>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="payment">Payment Method</TabsTrigger>
              <TabsTrigger value="summary">Order Summary</TabsTrigger>
            </TabsList>
            
            <TabsContent value="payment" className="space-y-4">
              <PaymentMethods
                selectedMethod={selectedPaymentMethod}
                onSelectMethod={setSelectedPaymentMethod}
                onProcessPayment={processPayment}
                total={totalAmount}
                isLoading={isProcessing}
              />
            </TabsContent>
            
            <TabsContent value="summary">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="space-y-2">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span>${(item.total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}