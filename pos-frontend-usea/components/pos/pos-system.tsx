// components/pos/pos-system.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Search, 
  Plus, 
  Minus, 
  Trash2,
  User,
  CreditCard,
  DollarSign,
  Receipt,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { Product } from '@/types/product';
import { Customer } from '@/types/customer';
import { CartItem, CreateSaleData } from '@/types/pos';
import { productService } from '@/services/productService';
import { customerService } from '@/services/customerService';
import { saleService } from '@/services/saleService';
import { useAuth } from '@/contexts/auth-context';

export default function POSSystem() {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'mobile' | 'credit'>('cash');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [productsRes, customersRes] = await Promise.all([
        productService.getProducts({ status: 'active' }),
        customerService.getCustomers()
      ]);

      setProducts(productsRes.data || []);
      setCustomers(customersRes);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? updateCartItem(item, item.quantity + 1)
          : item
      ));
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        product,
        quantity: 1,
        subtotal: Number(product.price),
        tax: Number(product.price) * (Number(product.tax_rate) / 100),
        discount: 0,
        total: Number(product.price) * (1 + Number(product.tax_rate) / 100)
      };
      setCart([...cart, newItem]);
    }
  };

  const updateCartItem = (item: CartItem, newQuantity: number): CartItem => {
    const subtotal = Number(item.product.price) * newQuantity;
    const tax = subtotal * (Number(item.product.tax_rate) / 100);
    const total = subtotal + tax - item.discount;

    return {
      ...item,
      quantity: newQuantity,
      subtotal,
      tax,
      total
    };
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(cart.map(item =>
      item.product.id === productId
        ? updateCartItem(item, newQuantity)
        : item
    ));
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const calculateTotals = () => {
    const subtotal_amount = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const tax_amount = cart.reduce((sum, item) => sum + item.tax, 0);
    const discount_amount = cart.reduce((sum, item) => sum + item.discount, 0);
    const total_amount = subtotal_amount + tax_amount - discount_amount;

    return { subtotal_amount, tax_amount, discount_amount, total_amount };
  };

  const processSale = async () => {
    if (cart.length === 0 || !user) return;

    setIsProcessing(true);
    try {
      const totals = calculateTotals();
      
      const saleData: CreateSaleData = {
        customer_id: selectedCustomer?.id,
        cashier_id: user.id,
        payment_method: paymentMethod,
        items: cart.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: Number(item.product.price),
          tax_rate: Number(item.product.tax_rate),
          discount_amount: item.discount
        })),
        ...totals
      };

      const sale = await saleService.createSale(saleData);
      
      if (sale) {
        setCart([]);
        setSelectedCustomer(null);
        alert('Sale completed successfully!');
      } else {
        alert('Error processing sale');
      }
    } catch (error) {
      console.error('Error processing sale:', error);
      alert('Error processing sale');
    } finally {
      setIsProcessing(false);
    }
  };

  const { subtotal_amount, tax_amount, discount_amount, total_amount } = calculateTotals();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
              <p className="text-gray-600">Welcome back, {user.first_name}!</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium">{user.first_name} {user.last_name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge variant="secondary">{user.role}</Badge>
                  <span>Shift: {user.shift}</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Products
                </CardTitle>
                <Input
                  placeholder="Search products by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {filteredProducts.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <ProductCard 
                            product={product} 
                            onAddToCart={addToCart}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Employee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <UserIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-600">{user.employee_id}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant="outline">{user.shift}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <CartSection
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              subtotal={subtotal_amount}
              tax={tax_amount}
              discount={discount_amount}
              total={total_amount}
            />

            <CustomerSection
              customers={customers}
              selectedCustomer={selectedCustomer}
              onSelectCustomer={setSelectedCustomer}
            />

            <PaymentSection
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onProcessSale={processSale}
              isProcessing={isProcessing}
              totalAmount={total_amount}
              cartEmpty={cart.length === 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductCard = ({ product, onAddToCart }: { 
  product: Product; 
  onAddToCart: (product: Product) => void;
}) => (
  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
    <CardContent className="p-4">
      <div className="aspect-square bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <ShoppingCart className="w-8 h-8 text-gray-400" />
        )}
      </div>
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{product.sku}</p>
      <div className="flex items-center justify-between">
        <span className="font-bold text-lg">KSh {Number(product.price).toLocaleString()}</span>
        <Badge variant={product.quantity > 0 ? "default" : "destructive"}>
          {product.quantity} in stock
        </Badge>
      </div>
      <Button 
        className="w-full mt-3"
        onClick={() => onAddToCart(product)}
        disabled={product.quantity === 0}
      >
        Add to Cart
      </Button>
    </CardContent>
  </Card>
);

const CartSection = ({ 
  cart, 
  onUpdateQuantity, 
  onRemoveItem, 
  subtotal, 
  tax, 
  discount, 
  total 
}: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        Cart ({cart.length})
      </CardTitle>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-64">
        <AnimatePresence>
          {cart.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 py-8"
            >
              <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Your cart is empty</p>
            </motion.div>
          ) : (
            cart.map((item: CartItem) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between py-3 border-b"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.product.name}</h4>
                  <p className="text-sm text-gray-500">KSh {item.product.price.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.product.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </ScrollArea>

      {cart.length > 0 && (
        <>
          <Separator className="my-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>KSh {tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>KSh {discount.toLocaleString()}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>KSh {total.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}
    </CardContent>
  </Card>
);

const CustomerSection = ({ customers, selectedCustomer, onSelectCustomer }: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <User className="w-5 h-5" />
        Customer
      </CardTitle>
    </CardHeader>
    <CardContent>
      <select
        className="w-full p-2 border rounded-md"
        value={selectedCustomer?.id || ''}
        onChange={(e) => {
          const customer = customers.find((c: Customer) => c.id === parseInt(e.target.value));
          onSelectCustomer(customer || null);
        }}
      >
        <option value="">Walk-in Customer</option>
        {customers.map((customer: Customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.first_name} {customer.last_name}
          </option>
        ))}
      </select>
      {selectedCustomer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 p-3 bg-green-50 rounded-md"
        >
          <p className="font-medium">
            {selectedCustomer.first_name} {selectedCustomer.last_name}
          </p>
          <p className="text-sm text-gray-600">{selectedCustomer.email}</p>
          <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
          <Badge variant="secondary" className="mt-1">
            {selectedCustomer.tier}
          </Badge>
        </motion.div>
      )}
    </CardContent>
  </Card>
);

const PaymentSection = ({ 
  paymentMethod, 
  onPaymentMethodChange, 
  onProcessSale, 
  isProcessing, 
  totalAmount,
  cartEmpty
}: any) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CreditCard className="w-5 h-5" />
        Payment
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant={paymentMethod === 'cash' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('cash')}
          className="flex flex-col h-16"
        >
          <DollarSign className="w-4 h-4" />
          <span className="text-xs">Cash</span>
        </Button>
        <Button
          variant={paymentMethod === 'card' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('card')}
          className="flex flex-col h-16"
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-xs">Card</span>
        </Button>
        <Button
          variant={paymentMethod === 'mobile' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('mobile')}
          className="flex flex-col h-16"
        >
          <Receipt className="w-4 h-4" />
          <span className="text-xs">Mobile</span>
        </Button>
        <Button
          variant={paymentMethod === 'credit' ? 'default' : 'outline'}
          onClick={() => onPaymentMethodChange('credit')}
          className="flex flex-col h-16"
        >
          <CreditCard className="w-4 h-4" />
          <span className="text-xs">Credit</span>
        </Button>
      </div>

      <Button
        className="w-full h-12 text-lg font-semibold"
        onClick={onProcessSale}
        disabled={isProcessing || cartEmpty}
      >
        {isProcessing ? (
          <>Processing...</>
        ) : (
          <>Complete Sale - KSh {totalAmount.toLocaleString()}</>
        )}
      </Button>
    </CardContent>
  </Card>
);