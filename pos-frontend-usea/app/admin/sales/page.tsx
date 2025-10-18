"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesStats } from "@/components/sales/sales-stats";
import { SalesChart } from "@/components/sales/sales-chart";
import { RecentSales } from "@/components/sales/recent-sales";
import { TopProducts } from "@/components/sales/top-products";
import { PaymentMethodsStats } from "@/components/sales/payment-methods-stats";
import { SalesFilters } from "@/components/sales/sales-filters";
import { 
  Sale, 
  SalesSummary, 
  SalesTrend, 
  TopProduct, 
  PaymentMethodStats,
  SalesFilter 
} from "@/types/sale";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

// Mock data - replace with actual API calls
const mockSalesSummary: SalesSummary = {
  totalSales: 28450.75,
  totalTransactions: 342,
  averageOrderValue: 83.19,
  taxCollected: 2276.06,
  discountGiven: 1250.50,
  netSales: 29476.31,
};

const mockPreviousSummary: SalesSummary = {
  totalSales: 24580.25,
  totalTransactions: 298,
  averageOrderValue: 82.48,
  taxCollected: 1966.42,
  discountGiven: 980.75,
  netSales: 25565.92,
};

const mockSalesTrend: SalesTrend[] = [
  { date: 'Mon', sales: 4250, transactions: 48, averageOrderValue: 88.54 },
  { date: 'Tue', sales: 3890, transactions: 45, averageOrderValue: 86.44 },
  { date: 'Wed', sales: 5120, transactions: 58, averageOrderValue: 88.28 },
  { date: 'Thu', sales: 4780, transactions: 52, averageOrderValue: 91.92 },
  { date: 'Fri', sales: 6250, transactions: 68, averageOrderValue: 91.91 },
  { date: 'Sat', sales: 5820, transactions: 61, averageOrderValue: 95.41 },
  { date: 'Sun', sales: 4340, transactions: 50, averageOrderValue: 86.80 },
];

const mockRecentSales: Sale[] = [
  {
    id: "1",
    transactionId: "TXN-001",
    customer: {
      id: "cust1",
      name: "John Doe",
      email: "john.doe@example.com"
    },
    items: [
      {
        id: "item1",
        productId: "prod1",
        productName: "Wireless Headphones",
        sku: "WH-001",
        quantity: 1,
        unitPrice: 199.99,
        totalPrice: 199.99,
        category: "Electronics"
      }
    ],
    totalAmount: 215.99,
    tax: 16.00,
    discount: 0,
    paymentMethod: "card",
    status: "completed",
    cashier: {
      id: "cash1",
      name: "Sarah Johnson"
    },
    createdAt: new Date('2024-01-15T14:30:00'),
    updatedAt: new Date('2024-01-15T14:30:00')
  },
  {
    id: "2",
    transactionId: "TXN-002",
    customer: {
      id: "cust2",
      name: "Jane Smith",
      email: "jane.smith@example.com"
    },
    items: [
      {
        id: "item2",
        productId: "prod2",
        productName: "Smartphone Case",
        sku: "SC-001",
        quantity: 2,
        unitPrice: 29.99,
        totalPrice: 59.98,
        category: "Accessories"
      },
      {
        id: "item3",
        productId: "prod3",
        productName: "USB-C Cable",
        sku: "UC-001",
        quantity: 1,
        unitPrice: 19.99,
        totalPrice: 19.99,
        category: "Accessories"
      }
    ],
    totalAmount: 86.37,
    tax: 6.40,
    discount: 0,
    paymentMethod: "mobile",
    status: "completed",
    cashier: {
      id: "cash2",
      name: "Mike Chen"
    },
    createdAt: new Date('2024-01-15T13:15:00'),
    updatedAt: new Date('2024-01-15T13:15:00')
  },
  {
    id: "3",
    transactionId: "TXN-003",
    items: [
      {
        id: "item4",
        productId: "prod4",
        productName: "Laptop Backpack",
        sku: "LB-001",
        quantity: 1,
        unitPrice: 89.99,
        totalPrice: 89.99,
        category: "Bags"
      }
    ],
    totalAmount: 97.19,
    tax: 7.20,
    discount: 0,
    paymentMethod: "cash",
    status: "completed",
    cashier: {
      id: "cash1",
      name: "Sarah Johnson"
    },
    createdAt: new Date('2024-01-15T12:45:00'),
    updatedAt: new Date('2024-01-15T12:45:00')
  }
];

const mockTopProducts: TopProduct[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    category: "Electronics",
    sales: 45,
    quantity: 45,
    revenue: 8995.55,
    growth: 12.5
  },
  {
    id: "2",
    name: "Smartphone Case",
    category: "Accessories",
    sales: 128,
    quantity: 128,
    revenue: 3838.72,
    growth: 8.2
  },
  {
    id: "3",
    name: "USB-C Cable",
    category: "Accessories",
    sales: 95,
    quantity: 95,
    revenue: 1899.05,
    growth: 15.7
  },
  {
    id: "4",
    name: "Laptop Backpack",
    category: "Bags",
    sales: 32,
    quantity: 32,
    revenue: 2879.68,
    growth: -2.1
  },
  {
    id: "5",
    name: "Wireless Mouse",
    category: "Electronics",
    sales: 67,
    quantity: 67,
    revenue: 2679.33,
    growth: 5.8
  }
];

const mockPaymentStats: PaymentMethodStats[] = [
  { method: 'card', count: 189, amount: 15845.25, percentage: 55 },
  { method: 'cash', count: 87, amount: 7245.50, percentage: 25 },
  { method: 'mobile', count: 52, amount: 4320.75, percentage: 15 },
  { method: 'credit', count: 14, amount: 1039.25, percentage: 5 },
];

export default function SalesPage() {
  const [filters, setFilters] = useState<SalesFilter>({
    period: 'week'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = (sale: Sale) => {
    console.log('View sale details:', sale);
    // Implement view details functionality
  };

  const handleRefund = (sale: Sale) => {
    console.log('Process refund for:', sale);
    // Implement refund functionality
  };

  const handleExport = () => {
    console.log('Export sales data with filters:', filters);
    // Implement export functionality
  };

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your sales performance and transactions
          </p>
        </div>
        <Button onClick={refreshData} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <SalesFilters
        filters={filters}
        onFiltersChange={setFilters}
        onExport={handleExport}
      />

      {/* Sales Stats */}
      <SalesStats 
        summary={mockSalesSummary} 
        previousPeriodSummary={mockPreviousSummary}
      />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <SalesChart data={mockSalesTrend} period="Last 7 Days" />

            {/* Top Products */}
            <TopProducts products={mockTopProducts} />
          </div>

          {/* Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <PaymentMethodsStats stats={mockPaymentStats} />
            </div>
            <div className="lg:col-span-3">
              <RecentSales
                sales={mockRecentSales}
                onViewDetails={handleViewDetails}
                onRefund={handleRefund}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <RecentSales
            sales={mockRecentSales}
            onViewDetails={handleViewDetails}
            onRefund={handleRefund}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={mockSalesTrend} period="Last 7 Days" />
            <PaymentMethodsStats stats={mockPaymentStats} />
            <div className="lg:col-span-2">
              <TopProducts products={mockTopProducts} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}