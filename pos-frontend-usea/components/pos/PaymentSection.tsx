// components/pos/PaymentSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, DollarSign, Smartphone, Receipt } from "lucide-react";
import { PaymentMethod } from '@/types/pos';
import { formatCurrency } from '@/lib/utils';

interface PaymentSectionProps {
  cart: any[];
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onCheckout: () => void;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
}

export const PaymentSection = ({
  cart,
  paymentMethod,
  onPaymentMethodChange,
  onCheckout,
  subtotal,
  taxAmount,
  totalAmount
}: PaymentSectionProps) => {
  if (cart.length === 0) return null;

  const paymentMethods = [
    { key: 'cash' as PaymentMethod, label: 'Cash', icon: DollarSign },
    { key: 'card' as PaymentMethod, label: 'Card', icon: CreditCard },
    { key: 'mobile' as PaymentMethod, label: 'Mobile', icon: Smartphone },
    { key: 'credit' as PaymentMethod, label: 'Credit', icon: Receipt },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {paymentMethods.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant={paymentMethod === key ? 'default' : 'outline'}
              onClick={() => onPaymentMethodChange(key)}
              className="capitalize h-12"
            >
              <Icon className="h-4 w-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        <div className="space-y-2 bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between text-sm">
            <span>Subtotal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax:</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2">
            <span>Total:</span>
            <span className="text-green-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        <Button
          onClick={onCheckout}
          className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-semibold"
          size="lg"
        >
          Complete Sale - {formatCurrency(totalAmount)}
        </Button>
      </CardContent>
    </Card>
  );
};