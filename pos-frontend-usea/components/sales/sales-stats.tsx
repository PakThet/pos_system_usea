import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesSummary } from "@/types/sale";
import { 
  DollarSign, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp,
  Users,
  Percent
} from "lucide-react";

interface SalesStatsProps {
  summary: SalesSummary;
  previousPeriodSummary?: SalesSummary;
}

export function SalesStats({ summary, previousPeriodSummary }: SalesStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const stats = [
    {
      title: "Total Sales",
      value: formatCurrency(summary.totalSales),
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.totalSales, previousPeriodSummary.totalSales) : 0,
      description: "Gross sales amount"
    },
    {
      title: "Net Sales",
      value: formatCurrency(summary.netSales),
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.netSales, previousPeriodSummary.netSales) : 0,
      description: "After discounts & tax"
    },
    {
      title: "Transactions",
      value: summary.totalTransactions.toString(),
      icon: ShoppingCart,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.totalTransactions, previousPeriodSummary.totalTransactions) : 0,
      description: "Total orders"
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(summary.averageOrderValue),
      icon: CreditCard,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.averageOrderValue, previousPeriodSummary.averageOrderValue) : 0,
      description: "Average per transaction"
    },
    {
      title: "Tax Collected",
      value: formatCurrency(summary.taxCollected),
      icon: Users,
      color: "text-red-500",
      bgColor: "bg-red-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.taxCollected, previousPeriodSummary.taxCollected) : 0,
      description: "Total tax amount"
    },
    {
      title: "Discount Given",
      value: formatCurrency(summary.discountGiven),
      icon: Percent,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      growth: previousPeriodSummary ? calculateGrowth(summary.discountGiven, previousPeriodSummary.discountGiven) : 0,
      description: "Total discounts"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const isPositive = stat.growth >= 0;
        
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1">
                <span className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                  {isPositive ? '↗' : '↘'} {Math.abs(stat.growth).toFixed(1)}%
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}