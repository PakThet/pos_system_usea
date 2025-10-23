"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Filter, RefreshCw } from "lucide-react";
import { Order, OrderStatus, OrderStats } from "@/types/order";
import { OrdersStats } from "@/components/orders/orders-stats";
import { OrdersTable } from "@/components/orders/orders-table";
import { OrderDetailsDialog } from "@/components/orders/order-details-dialog";
import { useOrders } from "@/hooks/useOrders";
import { orderApi } from "@/services/orderApi";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);

  const {
    orders,
    loading,
    error,
    pagination,
    refetch
  } = useOrders({
    page: 1,
    perPage: 10,
  });

  // Helper function to calculate stats from orders
  const calculateStats = (orders: Order[]): OrderStats => {
    const stats: OrderStats = {
      total: orders.length,
      pending: orders.filter(o => o.status === "pending").length,
      confirmed: orders.filter(o => o.status === "confirmed").length,
      processing: orders.filter(o => o.status === "processing").length,
      shipped: orders.filter(o => o.status === "shipped").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      total_revenue: orders.reduce((sum, o) => sum + parseFloat(o.total_amount), 0),
      totalTax: orders.reduce((sum, o) => sum + parseFloat(o.tax_amount), 0),
      average_order_value: 0
    };

    stats.average_order_value = stats.total ? stats.total_revenue / stats.total : 0;

    return stats;
  };

  // Update stats whenever orders change
  useEffect(() => {
    if (orders && orders.length > 0) {
      setOrderStats(calculateStats(orders));
    }
  }, [orders]);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleEditOrder = (order: Order) => {
    console.log("Edit order:", order);
    // Implement edit functionality
  };

  const handleUpdateStatus = async (orderId: number, status: OrderStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId.toString(), status);
      refetch();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleExportOrders = () => {
    console.log("Export orders");
    // Implement export functionality
  };

  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
              <Button onClick={refetch} className="mt-4">
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">Manage and track your customer orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportOrders} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button disabled={loading}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Statistics */}
      {orderStats && <OrdersStats stats={orderStats} />}

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Recent Orders
            {loading && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                Loading...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={orders}
            // onView={handleViewOrder}
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