import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, CreditCard, DollarSign } from "lucide-react";
import { CartItem } from '@/types/pos';
import { CartItem as CartItemComponent } from './CartItem';
import { formatCurrency } from '@/lib/utils';

interface CartSummaryProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveFromCart: (productId: number) => void;
  onClearCart: () => void;
  paymentMethod: 'card' | 'cash' | 'mobile' | 'credit';
  onPaymentMethodChange: (method: 'card' | 'cash' | 'mobile' | 'credit') => void;
  onCheckout: () => void;
}

export function CartSummary({
  cart,
  onUpdateQuantity,
  onRemoveFromCart,
  onClearCart,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout
}: CartSummaryProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const totalAmount = subtotal + taxAmount;

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="h-4 w-4 mr-2" />;
      case 'cash': return <DollarSign className="h-4 w-4 mr-2" />;
      default: return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <div className="space-y-6">
      <CartSummary
        cart={cart}
        onUpdateQuantity={onUpdateQuantity}
        onRemoveFromCart={onRemoveFromCart}
        onClearCart={onClearCart}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={onPaymentMethodChange}
        onCheckout={onCheckout}
      />
      
      {cart.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {(['cash', 'card', 'mobile', 'credit'] as const).map((method) => (
                <Button
                  key={method}
                  variant={paymentMethod === method ? 'default' : 'outline'}
                  onClick={() => onPaymentMethodChange(method)}
                  className="capitalize h-11"
                >
                  {getPaymentIcon(method)}
                  {method}
                </Button>
              ))}
            </div>

            <Button
              onClick={onCheckout}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold shadow-lg"
              size="lg"
            >
              Complete Sale - {formatCurrency(totalAmount)}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}