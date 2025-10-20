// components/pos/customer-panel.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, UserPlus, X } from 'lucide-react';
import { Customer } from '@/types/customer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CustomerPanelProps {
  customer: Customer | null;
  onCustomerSelect: (customer: Customer) => void;
  onCustomerClear: () => void;
}

export function CustomerPanel({ customer, onCustomerSelect, onCustomerClear }: CustomerPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: ''
  });

  // Mock customer data - replace with API call
  const customers: Customer[] = [
    {
      id: '1',
      first_name: 'James',
      last_name: 'Kariuki',
      email: 'james.kariuki@email.com',
      phone: '+254711223344',
      status: 'active',
      tier: 'vip',
      total_orders: 15,
      total_spent: 125000,
      created_at: '2025-10-18T14:17:06.000000Z',
      updated_at: '2025-10-18T14:17:06.000000Z'
    },
    {
      id: '2',
      first_name: 'Grace',
      last_name: 'Nyambura',
      email: 'grace.nyambura@email.com',
      phone: '+254722334455',
      status: 'active',
      tier: 'premium',
      total_orders: 8,
      total_spent: 68000,
      created_at: '2025-10-18T14:17:06.000000Z',
      updated_at: '2025-10-18T14:17:06.000000Z'
    }
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  if (customer) {
    return (
      <div className="p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold">
                  {customer.first_name} {customer.last_name}
                </h4>
                <p className="text-sm text-blue-600 capitalize">{customer.tier} Tier</p>
              </div>
            </div>
            <button
              onClick={onCustomerClear}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>{customer.phone}</p>
            <p>{customer.email}</p>
            <p>Total Orders: {customer.total_orders}</p>
            <p>Total Spent: KSh {customer.total_spent?.toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <Input
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-3"
        />
        
        <Button
          onClick={() => setShowQuickAdd(true)}
          variant="outline"
          className="w-full"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Quick Add Customer
        </Button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filteredCustomers.map((cust, index) => (
          <motion.div
            key={cust.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onCustomerSelect(cust)}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {cust.first_name} {cust.last_name}
                </h4>
                <p className="text-xs text-gray-600">{cust.phone}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                cust.tier === 'vip' 
                  ? 'bg-purple-100 text-purple-800'
                  : cust.tier === 'premium'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {cust.tier}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}