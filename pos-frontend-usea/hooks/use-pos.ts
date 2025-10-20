// hooks/use-pos.ts
import { useState, useEffect } from 'react';
import { posApi } from '@/services/pos-api';
import { CartItem } from '@/types/pos';
import { Customer } from '@/types/customer';
import { Cashier } from '@/types/cashier';
import { Product } from '@/types/product';

export function usePOS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [cashier, setCashier] = useState<Cashier | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.total || 0), 0);
  const tax = cart.reduce((sum, item) => sum + (item.tax || 0), 0);
  const discount = cart.reduce((sum, item) => sum + (item.discount || 0), 0);
  const total = subtotal + tax - discount;
  
// use-pos.ts
const addToCart = (product: Product) => {
  setCart((currentCart) => {
    const existingItem = currentCart.find(item => item.product.id === product.id);

    if (existingItem) {
      return currentCart.map(item =>
        item.product.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
              subtotal: (item.quantity + 1) * parseFloat(product.price),
              tax: ((item.quantity + 1) * parseFloat(product.price)) * (parseFloat(product.tax_rate) / 100),
              total: (item.quantity + 1) * parseFloat(product.price) * (1 + parseFloat(product.tax_rate) / 100)
            }
          : item
      );
    }

    const newItem: CartItem = {
      id: product.id,
      product: { ...product, id: product.id },
      quantity: 1,
      subtotal: parseFloat(product.price),
      tax: parseFloat(product.price) * (parseFloat(product.tax_rate) / 100),
      discount: 0,
      total: parseFloat(product.price) * (1 + parseFloat(product.tax_rate) / 100)
    };

    return [...currentCart, newItem];
  });
};

const removeFromCart = (productId: number) => {
  setCart(currentCart => currentCart.filter(item => item.product.id === productId));
};

const updateQuantity = (productId: number, quantity: number) => {
  setCart(currentCart =>
    currentCart.map(item =>
      item.product.id === productId
        ? {
            ...item,
            quantity,
            subtotal: quantity * parseFloat(item.product.price),
            tax: quantity * parseFloat(item.product.price) * (parseFloat(item.product.tax_rate) / 100),
            total: quantity * parseFloat(item.product.price) * (1 + parseFloat(item.product.tax_rate) / 100)
          }
        : item
    )
  );
};


  // Process payment
  const processPayment = async (paymentData: any) => {
    try {
      const saleData = {
        customer_id: customer?.id,
        cashier_id: cashier?.id,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          sku: item.product.sku,
          category_name: item.product.category?.name,
          quantity: item.quantity,
          unit_price: parseFloat(item.product.price),
          tax_rate: parseFloat(item.product.tax_rate),
          total_price: item.total
        })),
        subtotal_amount: subtotal,
        tax_amount: tax,
        discount_amount: discount,
        total_amount: total,
        payment_method: paymentData.method,
        status: 'completed'
      };

      const response = await posApi.createSale(saleData);
      
      if (response.success) {
        clearCart();
        alert('Sale completed successfully!');
      }
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Payment failed. Please try again.');
    }
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    setCustomer(null);
  };

  // Load products
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await posApi.searchProducts('');
        if (response.success) {
          setProducts(response.data || []);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
      }
    };

    loadProducts();
  }, []);

  return {
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
  };
}
