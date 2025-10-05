"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Download, 
  Plus, 
  Filter,
  Users 
} from "lucide-react";
import { Customer, CustomerStats, CreateCustomerData } from "@/types/customer";
import { CustomersStats } from "@/components/customers-stats";
import { CustomersTable } from "@/components/customers-table";
import { CustomerDetailsDialog } from "@/components/customer-details-dialog";
import { CustomerForm } from "@/components/customer-form";

// Mock data - replace with actual API calls
const mockCustomers: Customer[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    tier: "premium",
    totalOrders: 12,
    totalSpent: 2450.75,
    lastOrder: new Date('2024-01-15'),
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2024-01-15'),
    address: {
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    }
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    status: "active",
    tier: "vip",
    totalOrders: 28,
    totalSpent: 5890.25,
    lastOrder: new Date('2024-01-14'),
    createdAt: new Date('2022-11-20'),
    updatedAt: new Date('2024-01-14'),
    notes: "Preferred customer, always buys premium products"
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@example.com",
    status: "inactive",
    tier: "standard",
    totalOrders: 3,
    totalSpent: 450.50,
    lastOrder: new Date('2023-12-01'),
    createdAt: new Date('2023-10-05'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice.brown@example.com",
    phone: "+1 (555) 456-7890",
    status: "active",
    tier: "premium",
    totalOrders: 15,
    totalSpent: 3200.00,
    lastOrder: new Date('2024-01-12'),
    createdAt: new Date('2023-03-15'),
    updatedAt: new Date('2024-01-12'),
    address: {
      street: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    }
  }
];

const mockStats: CustomerStats = {
  total: 1247,
  active: 984,
  inactive: 263,
  newThisMonth: 42,
  premium: 156,
  vip: 28,
  averageOrderValue: 189.50
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetails(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleContactCustomer = (customer: Customer) => {
    // Implement contact functionality
    console.log('Contact customer:', customer);
  };

  const handleCreateCustomer = async (data: CreateCustomerData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...data,
      status: "active",
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setCustomers(prev => [...prev, newCustomer]);
    setShowForm(false);
    setIsLoading(false);
  };

  const handleUpdateCustomer = async (data: CreateCustomerData) => {
    if (!editingCustomer) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCustomers(prev =>
      prev.map(customer =>
        customer.id === editingCustomer.id
          ? { 
              ...customer, 
              ...data, 
              updatedAt: new Date() 
            }
          : customer
      )
    );
    
    setEditingCustomer(null);
    setShowForm(false);
    setIsLoading(false);
  };

  const handleExportCustomers = () => {
    // Implement export functionality
    console.log('Export customers');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Customers
          </h1>
          <p className="text-muted-foreground">
            Manage your customer relationships and data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCustomers}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <CustomersStats stats={mockStats} />

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomersTable
            customers={customers}
            onView={handleViewCustomer}
            onEdit={handleEditCustomer}
            onContact={handleContactCustomer}
          />
        </CardContent>
      </Card>

      {/* Customer Details Dialog */}
      <CustomerDetailsDialog
        customer={selectedCustomer}
        open={showDetails}
        onOpenChange={setShowDetails}
        onEdit={handleEditCustomer}
      />

      {/* Customer Form Dialog */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </CardTitle>
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