"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Plus, Users, RefreshCw } from "lucide-react";
import { Customer, CustomerStats, CreateCustomerData } from "@/types/customer";
import { CustomersStats } from "@/components/customers/customers-stats";
import { CustomersTable } from "@/components/customers/customers-table";
import { CustomerDetailsDialog } from "@/components/customers/customer-details-dialog";
import { CustomerForm } from "@/components/customers/customer-form";
import { toast } from "sonner";
import { customerApi } from "@/services/customerApi";

const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

// Mock data
const mockCustomers: Customer[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    tier: "premium",
    total_orders: 12,
    total_spent: 2450.75,
    last_order: new Date("2024-01-15").toISOString(),
    created_at: new Date("2023-05-10").toISOString(),
    updated_at: new Date("2024-01-15").toISOString(),
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip_code: "10001",
      country: "USA",
    },
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    tier: "vip",
    total_orders: 28,
    total_spent: 5890.25,
    last_order: new Date("2024-01-14").toISOString(),
    created_at: new Date("2022-11-20").toISOString(),
    updated_at: new Date("2024-01-14").toISOString(),
    notes: "Preferred customer, always buys premium products",
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zip_code: "90210",
      country: "USA",
    },
  },
];


const mockStats: CustomerStats = {
  total: 156,
  active: 142,
  inactive: 14,
  new_this_month: 12,
  premium: 45,
  vip: 22,
  average_order_value: 1823.72,
  tierDistribution: { standard: 89, premium: 45, vip: 22 },
};

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
  last_order: apiCustomer.last_order || undefined,
  notes: apiCustomer.notes || "",
  created_at: apiCustomer.created_at,
  updated_at: apiCustomer.updated_at,
  address:
    apiCustomer.address?.map((a: any) => ({
      street: a.street ?? "",
      city: a.city ?? "",
      state: a.state ?? "",
      zip_code: a.zip_code ?? "",
      country: a.country ?? "",
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

  useEffect(() => {
    fetchCustomers();
    fetchStats();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsRefreshing(true);
      if (!USE_API) setCustomers(mockCustomers);
      else {
        const response = await customerApi.getCustomers();
        if (response.success) setCustomers(response.data.map(transformApiCustomer));
        else toast.error("Failed to fetch customers");
      }
    } catch {
      toast.error("Failed to fetch customers");
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchStats = async () => {
    try {
      if (!USE_API) setStats(mockStats);
      else {
        const response = await customerApi.getCustomerStats();
        if (response.success) setStats(response.data);
        else toast.error("Failed to fetch customer statistics");
      }
    } catch {
      toast.error("Failed to fetch customer statistics");
    }
  };

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    setIsLoading(true);
    try {
      const newCustomer: Customer = {
        id: Date.now().toString(),
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone ?? "",
        status: data.status ?? "active",
        tier: data.tier ?? "standard",
        total_orders: 0,
        total_spent: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        address: data.address
  ? {
      street: data.address.street ?? "",
      city: data.address.city ?? "",
      state: data.address.state ?? "",
      zip_code: data.address.zip_code ?? "",
      country: data.address.country ?? "",
    }
  : customers[0].address,

      };

      if (!USE_API) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCustomers((prev) => [...prev, newCustomer]);
        setShowForm(false);
        toast.success("Customer created successfully");
      } else {
        const response = await customerApi.createCustomer(data);
        if (response.success) {
          setCustomers((prev) => [...prev, transformApiCustomer(response.data)]);
          fetchStats();
          setShowForm(false);
          toast.success("Customer created successfully");
        } else toast.error("Failed to create customer");
      }
    } catch {
      toast.error("Failed to create customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCustomer = async (data: CreateCustomerData) => {
    if (!editingCustomer) return;
    setIsLoading(true);
    try {
      if (!USE_API) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setCustomers((prev) =>
          prev.map((customer) =>
            customer.id === editingCustomer.id
              ? {
                  ...customer,
                  first_name: data.first_name,
                  last_name: data.last_name,
                  email: data.email,
                  phone: data.phone ?? "",
                  status: data.status ?? customer.status,
                  tier: data.tier ?? customer.tier,
                  notes: data.notes ?? customer.notes ?? "",
                  address: data.address
  ? {
      street: data.address.street ?? "",
      city: data.address.city ?? "",
      state: data.address.state ?? "",
      zip_code: data.address.zip_code ?? "",
      country: data.address.country ?? "",
    }
  : customer.address,

                  updated_at: new Date().toISOString(),
                }
              : customer
          )
        );
        setEditingCustomer(null);
        setShowForm(false);
        toast.success("Customer updated successfully");
      } else {
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
        } else toast.error("Failed to update customer");
      }
    } catch {
      toast.error("Failed to update customer");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    try {
      const customerToDelete = customers.find((c) => c.id === customerId);
      if (!customerToDelete) return;

      if (!USE_API) {
        setCustomers((prev) => prev.filter((c) => c.id !== customerId));
        toast.success("Customer deleted successfully");
      } else {
        const response = await customerApi.deleteCustomer(customerId);
        if (response.success) {
          setCustomers((prev) => prev.filter((c) => c.id !== customerId));
          fetchStats();
          toast.success("Customer deleted successfully");
        } else toast.error("Failed to delete customer");
      }
    } catch {
      toast.error("Failed to delete customer");
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
            onDelete={handleDeleteCustomer}
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
    </div>
  );
}
