"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Plus, Filter } from "lucide-react";
import { Order, OrderStats } from "@/types/order";
import { OrdersStats } from "@/components/orders-stats";
import { OrdersTable } from "@/components/orders-table";
import { OrderDetailsDialog } from "@/components/order-details-dialog";

// Mock data - replace with actual API calls
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: {
      id: "cust1",
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567"
    },
    items: [
      {
        id: "item1",
        productId: "prod1",
        productName: "Wireless Headphones",
        price: 199.99,
        quantity: 1
      },
      {
        id: "item2",
        productId: "prod2",
        productName: "Phone Case",
        price: 29.99,
        quantity: 2
      }
    ],
    status: "processing",
    paymentStatus: "paid",
    totalAmount: 259.97,
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    billingAddress: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA"
    },
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    estimatedDelivery: new Date('2024-01-20')
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customer: {
      id: "cust2",
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    items: [
      {
        id: "item3",
        productId: "prod3",
        productName: "Laptop Backpack",
        price: 89.99,
        quantity: 1
      }
    ],
    status: "shipped",
    paymentStatus: "paid",
    totalAmount: 89.99,
    shippingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    billingAddress: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      country: "USA"
    },
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
    trackingNumber: "TRK123456789"
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customer: {
      id: "cust3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com"
    },
    items: [
      {
        id: "item4",
        productId: "prod4",
        productName: "Smart Watch",
        price: 299.99,
        quantity: 1
      },
      {
        id: "item5",
        productId: "prod5",
        productName: "Screen Protector",
        price: 19.99,
        quantity: 1
      }
    ],
    status: "pending",
    paymentStatus: "pending",
    totalAmount: 319.98,
    shippingAddress: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    billingAddress: {
      street: "789 Pine Rd",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA"
    },
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16')
  }
];

const mockStats: OrderStats = {
  total: 156,
  pending: 12,
  confirmed: 8,
  processing: 23,
  shipped: 45,
  delivered: 65,
  cancelled: 3
};

export default function page() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleEditOrder = (order: Order) => {
    // Implement edit functionality
    console.log('Edit order:', order);
  };

  const handleUpdateStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date() }
          : order
      )
    );
  };

  const handleExportOrders = () => {
    // Implement export functionality
    console.log('Export orders');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <OrdersStats stats={mockStats} />

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={orders}
            onView={handleViewOrder}
            onEdit={handleEditOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </div>
  );
}