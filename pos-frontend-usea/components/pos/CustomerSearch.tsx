'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Customer } from '@/types/customer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Search, X, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { customerApi } from '@/services/customerApi';

interface CustomerSearchProps {
  selectedCustomer: Customer | null;
  onCustomerSelect: (customer: Customer | null) => void;
}

export default function CustomerSearch({
  selectedCustomer,
  onCustomerSelect,
}: CustomerSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (searchQuery.length > 2) searchCustomers();
    else setCustomers([]);
  }, [searchQuery]);

  const searchCustomers = async () => {
    setIsSearching(true);
    try {
      const response = await customerApi.searchCustomers(searchQuery);
      if (response.success) setCustomers(response.data as Customer[]);
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="px-6 py-3 bg-gray-50 border-b relative">
      <div className="flex items-center space-x-2">
        {selectedCustomer ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full"
          >
            <User className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedCustomer.tier}
            </Badge>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => onCustomerSelect(null)}
            >
              <X className="h-3 w-3" />
            </Button>
          </motion.div>
        ) : (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search customer by name or email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {searchQuery && customers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-6 right-6 z-10 mt-1"
          >
            <Card>
              <CardContent className="p-2 max-h-60 overflow-auto">
                {customers.map(customer => (
                  <motion.div
                    key={customer.id}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className="p-2 rounded cursor-pointer"
                    onClick={() => {
                      onCustomerSelect(customer);
                      setSearchQuery('');
                      setCustomers([]);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">
                          {customer.first_name} {customer.last_name}
                        </p>
                        <p className="text-xs text-gray-500">{customer.email}</p>
                      </div>
                      <Badge variant="outline">{customer.tier}</Badge>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
