// app/admin/sales/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Download,
  Filter,
  Calendar,
  User,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { api } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Sale {
  id: number;
  transaction_id: string;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  payment_method: 'card' | 'cash' | 'mobile' | 'credit';
  total_amount: string;
  customer?: {
    first_name: string;
    last_name: string;
  };
  cashier: {
    first_name: string;
    last_name: string;
  };
  created_at: string;
  items_count: number;
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      const response = await api.get('/sales');
      setSales(response.data.data.data);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter(sale =>
    sale.transaction_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer?.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.customer?.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cashier.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.cashier.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentMethodIcon = (method: string) => {
    const icons = {
      card: <CreditCard className="h-4 w-4" />,
      cash: <TrendingUp className="h-4 w-4" />,
      mobile: <CreditCard className="h-4 w-4" />,
      credit: <CreditCard className="h-4 w-4" />,
    };
    return icons[method as keyof typeof icons] || <CreditCard className="h-4 w-4" />;
  };

  const totalRevenue = sales.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const completedSales = sales.filter(sale => sale.status === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading sales...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales</h1>
          <p className="text-muted-foreground">
            View and manage all sales transactions
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold mt-1">
                  {formatCurrency(totalRevenue)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                <p className="text-2xl font-bold mt-1">{sales.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold mt-1">{completedSales}</p>
              </div>
              <div className="p-3 rounded-full bg-purple-50">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search sales by transaction ID, customer, or cashier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <div className="space-y-4">
        {filteredSales.map((sale, index) => (
          <motion.div
            key={sale.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
                      <h3 className="font-semibold text-lg">{sale.transaction_id}</h3>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(sale.status)}>
                          {sale.status}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getPaymentMethodIcon(sale.payment_method)}
                          {sale.payment_method}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {sale.customer 
                            ? `${sale.customer.first_name} ${sale.customer.last_name}`
                            : 'Walk-in Customer'
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Cashier: {sale.cashier.first_name} {sale.cashier.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDateTime(sale.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(parseFloat(sale.total_amount))}
                      </p>
                      <p className="text-sm text-muted-foreground">{sale.items_count} items</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredSales.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No sales found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'No sales transactions yet'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}