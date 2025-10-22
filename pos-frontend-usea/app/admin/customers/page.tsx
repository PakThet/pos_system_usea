'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { 
  Plus, 
  Users,
  RefreshCw,
  Download,
  Trash2
} from "lucide-react";
import { Customer, CreateCustomerData, UpdateCustomerData } from '@/types/customer';
import { CustomersStats } from '@/components/customers/customers-stats';
import { CustomersTable } from '@/components/customers/customers-table';
import { CustomerForm } from '@/components/customers/customer-form';
import { CustomerDetailsDialog } from '@/components/customers/customer-details-dialog';
import { customerApi } from '@/services/customerApi';
import { LoadingSpinner } from '@/components/customers/LoadingSpinner';
import { ErrorAlert } from '@/components/customers/ErrorAlert';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Selected Data
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError(null);
      const [customersResponse, statsResponse] = await Promise.all([
        customerApi.getCustomers(),
        customerApi.getCustomerStats()
      ]);
      
      setCustomers(customersResponse.data);
      setStats(statsResponse.data);
    } catch (err) {
      setError('Failed to load customers data');
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await customerApi.createCustomer(data);
      setCustomers(prev => [response.data, ...prev]);
      setShowForm(false);
      await loadData(); // Refresh stats
    } catch (err) {
      setError('Failed to create customer');
      console.error('Error creating customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (data: UpdateCustomerData) => {
    if (!editingCustomer) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await customerApi.updateCustomer(editingCustomer.id, data);
      setCustomers(prev => 
        prev.map(customer => 
          customer.id === editingCustomer.id ? response.data : customer
        )
      );
      setShowForm(false);
      setEditingCustomer(null);
    } catch (err) {
      setError('Failed to update customer');
      console.error('Error updating customer:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;

    try {
      setError(null);
      await customerApi.deleteCustomer(customerToDelete.id);
      setCustomers(prev => prev.filter(customer => customer.id !== customerToDelete.id));
      setShowDeleteConfirm(false);
      setCustomerToDelete(null);
      await loadData(); 
    } catch (err) {
      setError('Failed to delete customer');
      console.error('Error deleting customer:', err);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleContactCustomer = (customer: Customer) => {
    // Implement contact logic
    console.log('Contact customer:', customer);
  };

  const confirmDeleteCustomer = (customer: Customer) => {
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleExportCustomers = async () => {
    try {
      setError(null);
      const response = await customerApi.exportCustomers();
      // Trigger download
      window.open(response.data.url, '_blank');
    } catch (err) {
      setError('Failed to export customers');
      console.error('Error exporting customers:', err);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" /> 
            Customers
          </h1>
          <p className="text-muted-foreground">Manage your customer relationships and data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="h-4 w-4 mr-2" /> 
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> 
            Add Customer
          </Button>
        </div>
      </motion.div>

      {/* Error Alert */}
      {error && <ErrorAlert error={error} onDismiss={() => setError(null)} />}

      {/* Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CustomersStats stats={stats} />
        </motion.div>
      )}

      {/* Customers Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-0">
            <CustomersTable
              customers={customers}
              onView={(customer) => {
                setSelectedCustomer(customer);
                setShowDetails(true);
              }}
              onEdit={handleEditCustomer}
              onContact={handleContactCustomer}
              onDelete={confirmDeleteCustomer}
              isLoading={isRefreshing}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={showDetails}
        onOpenChange={setShowDetails}
        onEdit={handleEditCustomer}
      />

      {/* Customer Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <CustomerForm
                customer={editingCustomer || undefined}
                onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
                onCancel={handleCancelForm}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="mb-4">
            Are you sure you want to delete{" "}
            <strong>
              {customerToDelete?.first_name} {customerToDelete?.last_name}
            </strong>
            ? This action cannot be undone.
          </p>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCustomer} className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" /> 
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}