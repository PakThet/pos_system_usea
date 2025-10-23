"use client";

import { useState, useEffect } from "react";
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
import { Download, RefreshCw, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { salesApi } from "@/services/saleApi";

export default function SalesPage() {
  const [filters, setFilters] = useState<SalesFilter>({
    period: 'week',
    page: 1,
    perPage: 10
  });
  const [isLoading, setIsLoading] = useState(false);
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentMethodStats[]>([]);
  const [salesTrend, setSalesTrend] = useState<SalesTrend[]>([]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsResponse, salesResponse] = await Promise.all([
        salesApi.getSalesStats(filters),
        salesApi.getSales(filters)
      ]);

      setSalesSummary(statsResponse.data);
      setRecentSales(salesResponse.data.data);
      generateDerivedData(salesResponse.data.data, statsResponse.data);

      toast.success("Data refreshed successfully!");
    } catch (error) {
      console.error('Failed to load sales data:', error);
      toast.error('Failed to load sales data');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDerivedData = (sales: Sale[], summary: SalesSummary) => {
    const trendData = generateTrendData(sales);
    setSalesTrend(trendData);

    const topProductsData = generateTopProducts(sales);
    setTopProducts(topProductsData);

    const paymentStatsData = generatePaymentStats(summary);
    setPaymentStats(paymentStatsData);
  };

  const generateTrendData = (sales: Sale[]): SalesTrend[] => {
    const salesByDate = sales.reduce((acc: any, sale) => {
      const date = new Date(sale.created_at).toLocaleDateString('en-US', { weekday: 'short' });
      if (!acc[date]) {
        acc[date] = { sales: 0, transactions: 0, totalAmount: 0 };
      }
      acc[date].sales += parseFloat(sale.total_amount);
      acc[date].transactions += 1;
      acc[date].totalAmount += parseFloat(sale.total_amount);
      return acc;
    }, {});

    return Object.entries(salesByDate).map(([date, data]: [string, any]) => ({
      date,
      sales: data.sales,
      transactions: data.transactions,
      averageOrderValue: data.totalAmount / data.transactions
    }));
  };

  const generateTopProducts = (sales: Sale[]): TopProduct[] => {
    const productSales: { [key: string]: TopProduct } = {};

    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const productId = item.product_id.toString();
        if (!productSales[productId]) {
          productSales[productId] = {
            id: item.product_id,
            name: item.product_name,
            category: item.category_name,
            sales: 0,
            quantity: 0,
            revenue: 0,
            growth: Math.random() * 30 - 10
          };
        }
        productSales[productId].sales += 1;
        productSales[productId].quantity += item.quantity;
        productSales[productId].revenue += parseFloat(item.total_price);
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const generatePaymentStats = (summary: SalesSummary): PaymentMethodStats[] => {
    const totalAmount = summary.total_revenue;
    const breakdown = summary.payment_method_breakdown;

    return Object.entries(breakdown).map(([method, count]) => {
      const estimatedAmount = (count / summary.total_sales) * totalAmount;
      const percentage = totalAmount > 0 ? (estimatedAmount / totalAmount) * 100 : 0;

      return {
        method,
        count,
        amount: estimatedAmount,
        percentage
      };
    });
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleViewDetails = async (sale: Sale) => {
    try {
      const response = await salesApi.getSale(sale.id);
      console.log('Sale details:', response.data);
      toast.info(`Viewing details for ${sale.transaction_id}`);
    } catch (error) {
      console.error('Failed to load sale details:', error);
      toast.error('Failed to load sale details');
    }
  };

  const handleRefund = async (sale: Sale) => {
    try {
      await salesApi.updateSaleStatus(sale.id, 'refunded');
      toast.success('Sale refunded successfully');
      loadData();
    } catch (error) {
      console.error('Failed to process refund:', error);
      toast.error('Failed to process refund');
    }
  };

  const handleExport = () => {
    toast.info('Export functionality coming soon!');
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Sales Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor your sales performance and transactions in real-time
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg"
              size="lg"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <SalesFilters
            filters={filters}
            onFiltersChange={setFilters}
            onExport={handleExport}
          />
        </motion.div>

        {/* Sales Stats */}
        {salesSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <SalesStats summary={salesSummary} />
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-lg">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="transactions"
                className="data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                Transactions
              </TabsTrigger>
              <TabsTrigger 
                value="analytics"
                className="data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all duration-300"
              >
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                  <SalesChart data={salesTrend} period="Last 7 Days" />
                </div>
                <div className="xl:col-span-1">
                  <TopProducts products={topProducts} />
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                <div className="xl:col-span-1">
                  <PaymentMethodsStats stats={paymentStats} />
                </div>
                <div className="xl:col-span-3">
                  <RecentSales
                    sales={recentSales}
                    onViewDetails={handleViewDetails}
                    onRefund={handleRefund}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <RecentSales
                sales={recentSales}
                onViewDetails={handleViewDetails}
                onRefund={handleRefund}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <SalesChart data={salesTrend} period="Last 7 Days" />
                <PaymentMethodsStats stats={paymentStats} />
                <div className="xl:col-span-2">
                  <TopProducts products={topProducts} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}