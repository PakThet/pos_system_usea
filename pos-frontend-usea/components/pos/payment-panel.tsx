// components/pos/payment-panel.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Smartphone, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Customer } from '@/types/customer';

interface PaymentPanelProps {
  total: number;
  customer: Customer | null;
  onPaymentComplete: (paymentData: any) => void;
  onCancel: () => void;
}

export function PaymentPanel({ total, customer, onPaymentComplete, onCancel }: PaymentPanelProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash' | 'mobile' | 'credit'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const amount = parseFloat(amountReceived) || 0;
  const change = amount - total;

  const handlePayment = async () => {
    if (paymentMethod === 'cash' && amount < total) {
      alert('Amount received is less than total amount');
      return;
    }

    setIsProcessing(true);
    
    try {
      const paymentData = {
        method: paymentMethod,
        amount: total,
        change: change > 0 ? change : 0,
        customer_id: customer?.id,
        items: [], // Will be filled from cart
        tax: 0, // Will be calculated
        discount: 0 // Will be applied
      };
      
      await onPaymentComplete(paymentData);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-4">
      <h3 className="text-lg font-semibold mb-4">Payment</h3>
      
      {/* Total Amount */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-sm text-blue-600">Total Amount</p>
          <p className="text-3xl font-bold text-blue-700">
            KSh {total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-3">Payment Method</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
              paymentMethod === 'cash' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cash</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
              paymentMethod === 'card' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Card</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('mobile')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
              paymentMethod === 'mobile' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile</span>
          </button>
          
          <button
            onClick={() => setPaymentMethod('credit')}
            className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
              paymentMethod === 'credit' 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Credit</span>
          </button>
        </div>
      </div>

      {/* Amount Received */}
      {paymentMethod === 'cash' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6"
        >
          <label className="block text-sm font-medium mb-2">Amount Received</label>
          <Input
            type="number"
            value={amountReceived}
            onChange={(e) => setAmountReceived(e.target.value)}
            placeholder="Enter amount received"
            className="text-lg font-medium"
          />
          
          {amount > 0 && change >= 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex justify-between text-sm">
                <span>Change:</span>
                <span className="font-semibold text-green-700">
                  KSh {change.toLocaleString()}
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Customer Info */}
      {customer && (
        <div className="mb-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Customer</p>
          <p className="text-sm">
            {customer.first_name} {customer.last_name}
          </p>
          <p className="text-xs text-gray-600">{customer.tier} Tier</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-auto space-y-3">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || (paymentMethod === 'cash' && amount < total)}
          className="w-full"
          size="lg"
        >
          {isProcessing ? 'Processing...' : `Complete ${paymentMethod} Payment`}
        </Button>
        
        <Button
          onClick={onCancel}
          variant="outline"
          className="w-full"
        >
          Cancel Transaction
        </Button>
      </div>
    </div>
  );
}