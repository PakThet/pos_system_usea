// app/admin/cashiers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Phone,
  Clock,
  DollarSign
} from "lucide-react";
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface Cashier {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  role: 'cashier' | 'manager' | 'admin';
  shift: 'morning' | 'evening' | 'night';
  hourly_rate: string;
  total_sales: string;
  total_transactions: number;
  last_login_at: string;
}

export default function CashiersPage() {
  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadCashiers();
  }, []);

  const loadCashiers = async () => {
    try {
      const response = await api.get('/users');
      setCashiers(response.data.data.data);
    } catch (error) {
      console.error('Failed to load cashiers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCashiers = cashiers.filter(cashier =>
    cashier.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cashier.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cashier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cashier.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRoleColor = (role: string) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      manager: 'bg-blue-100 text-blue-800',
      cashier: 'bg-green-100 text-green-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getShiftColor = (shift: string) => {
    const colors = {
      morning: 'bg-yellow-100 text-yellow-800',
      evening: 'bg-orange-100 text-orange-800',
      night: 'bg-indigo-100 text-indigo-800',
    };
    return colors[shift as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">Loading cashiers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cashiers</h1>
          <p className="text-muted-foreground">
            Manage staff members and their permissions
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Staff
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search cashiers by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cashiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCashiers.map((cashier, index) => (
          <motion.div
            key={cashier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">
                    {cashier.first_name} {cashier.last_name}
                  </CardTitle>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge className={getStatusColor(cashier.status)}>
                      {cashier.status}
                    </Badge>
                    <Badge className={getRoleColor(cashier.role)}>
                      {cashier.role}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{cashier.employee_id}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{cashier.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{cashier.phone || 'No phone'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Badge className={getShiftColor(cashier.shift)}>
                      {cashier.shift} shift
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="text-center">
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(parseFloat(cashier.total_sales))}
                    </p>
                    <p className="text-xs text-muted-foreground">Total Sales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {cashier.total_transactions}
                    </p>
                    <p className="text-xs text-muted-foreground">Transactions</p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm">
                    <p className="font-semibold">
                      {formatCurrency(parseFloat(cashier.hourly_rate))}
                    </p>
                    <p className="text-xs text-muted-foreground">Hourly Rate</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredCashiers.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold">No cashiers found</h3>
            <p className="text-muted-foreground mt-2">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first staff member'}
            </p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}