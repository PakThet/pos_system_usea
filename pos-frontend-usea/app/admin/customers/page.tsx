"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Download, Plus, Users, RefreshCw, Trash2 } from "lucide-react";
import { Customer, CustomerStats, CreateCustomerData } from "@/types/customer";
import { CustomersStats } from "@/components/customers/customers-stats";
import { CustomersTable } from "@/components/customers/customers-table";
import { CustomerDetailsDialog } from "@/components/customers/customer-details-dialog";
import { CustomerForm } from "@/components/customers/customer-form";
import { toast } from "sonner";
import { customerApi } from "@/services/customerApi";

// Transform API response to app customer
const transformApiCustomer = (apiCustomer: any): Customer => ({
  id: apiCustomer.id.toString(),
  first_name: apiCustomer.first_name,
  last_name: apiCustomer.last_name,
  email: apiCustomer.email,
  phone: apiCustomer.phone || "",
  status: apiCustomer.status,
  tier: apiCustomer.tier,
  total_orders: apiCustomer.total_orders || 0,
  total_spent: parseFloat(apiCustomer.total_spent) || 0,
  last_order: apiCustomer.last_order_at || undefined,
  notes: apiCustomer.notes || "",
  created_at: apiCustomer.created_at,
  updated_at: apiCustomer.updated_at,
  address: apiCustomer.addresses?.map((a: any) => ({
    id: a.id.toString(),
    street: a.street ?? "",
    city: a.city ?? "",
    state: a.state ?? "",
    zip_code: a.zip_code ?? "",
    country: a.country ?? "",
    type: a.type ?? "both",
    is_default: a.is_default ?? false,
  })) || [],
});

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsRefreshing(true);
      const response = await customerApi.getCustomers();
      if (response.success) {
        setCustomers(response.data.map(transformApiCustomer));
      } else {
        toast.error("Failed to fetch customers");
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error("Failed to fetch customers");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customerApi.getCustomerStats();
      if (response.success) {
        setStats(response.data);
      } else {
        toast.error("Failed to fetch customer statistics");
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error("Failed to fetch customer statistics");
    }
  };

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    setIsLoading(true);
    try {
      const response = await customerApi.createCustomer(data);
      if (response.success) {
        setCustomers((prev) => [...prev, transformApiCustomer(response.data)]);
        fetchStats();
        setShowForm(false);
        toast.success("Customer created successfully");
      } else {
        toast.error(response.message || "Failed to create customer");
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      toast.error("Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (data: CreateCustomerData) => {
    if (!editingCustomer) return;
    setIsLoading(true);
    try {
      const response = await customerApi.updateCustomer(editingCustomer.id, data);
      if (response.success) {
        const apiCustomer = transformApiCustomer(response.data);
        setCustomers((prev) =>
          prev.map((c) => (c.id === editingCustomer.id ? apiCustomer : c))
        );
        setEditingCustomer(null);
        setShowForm(false);
        fetchStats();
        toast.success("Customer updated successfully");
      } else {
        toast.error(response.message || "Failed to update customer");
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error("Failed to update customer");
    } finally {
      setIsLoading(false);
    }
  };

  // Show confirmation modal before delete
const confirmDeleteCustomer = async (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    setCustomerToDelete(customer);
    setShowDeleteConfirm(true);
  };


  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setShowDeleteConfirm(false);

    try {
      const response = await customerApi.deleteCustomer(customerToDelete.id);
      if (response.success) {
        setCustomers((prev) => prev.filter((c) => c.id !== customerToDelete.id));
        fetchStats();
        toast.success("Customer deleted successfully");
      } else {
        toast.error(response.message || "Failed to delete customer");
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error("Failed to delete customer");
    } finally {
      setCustomerToDelete(null);
    }
  };

  const handleExportCustomers = () => toast.info("Export functionality coming soon");

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleRefresh = () => {
    fetchCustomers();
    fetchStats();
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleContactCustomer = (customer: Customer) => {
    toast.info(`Contacting ${customer.first_name} ${customer.last_name}`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" /> Customers
          </h1>
          <p className="text-muted-foreground">Manage your customer relationships and data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      {stats && <CustomersStats stats={stats} />}

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable
            customers={customers}
            onView={(c) => {
              setSelectedCustomer(c);
              setShowDetails(true);
            }}
            onEdit={handleEditCustomer}
            onContact={handleContactCustomer}
            onDelete={confirmDeleteCustomer}
            isLoading={isRefreshing}
          />
        </CardContent>
      </Card>

      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={showDetails}
        onOpenChange={setShowDetails}
        onEdit={handleEditCustomer}
      />

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingCustomer ? "Edit Customer" : "Add New Customer"}</CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
              customer={editingCustomer || undefined}
              onSubmit={editingCustomer ? handleUpdateCustomer : handleCreateCustomer}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
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
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
