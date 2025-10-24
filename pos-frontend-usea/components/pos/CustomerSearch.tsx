// components/pos/CustomerSearch.tsx
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, X } from "lucide-react";
import { Customer } from '@/types/pos';

interface CustomerSearchProps {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customer: Customer | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerSearch = ({
  customers,
  selectedCustomer,
  onSelectCustomer,
  isOpen,
  onClose
}: CustomerSearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const filteredCustomers = customers.filter(customer =>
    customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
    onClose();
    setSearchTerm('');
  };

  const handleClearCustomer = () => {
    onSelectCustomer(null);
  };

  if (!isOpen) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span>Customer</span>
            {selectedCustomer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCustomer}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCustomer ? (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border">
              <div className="flex-1">
                <p className="font-medium">
                  {selectedCustomer.first_name} {selectedCustomer.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{selectedCustomer.email}</p>
                {selectedCustomer.phone && (
                  <p className="text-sm text-muted-foreground">{selectedCustomer.phone}</p>
                )}
              </div>
              <Badge variant={
                selectedCustomer.tier === 'vip' ? 'default' :
                selectedCustomer.tier === 'premium' ? 'secondary' : 'outline'
              }>
                {selectedCustomer.tier}
              </Badge>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={onClose}
            >
              <User className="h-4 w-4 mr-2" />
              Select Customer
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Select Customer</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={searchInputRef}
              placeholder="Search customers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSelectCustomer(customer)}
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {customer.first_name} {customer.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                  {customer.phone && (
                    <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  )}
                </div>
                <Badge variant={
                  customer.tier === 'vip' ? 'default' :
                  customer.tier === 'premium' ? 'secondary' : 'outline'
                }>
                  {customer.tier}
                </Badge>
              </div>
            ))}
            
            {filteredCustomers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <User className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No customers found</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};