import { SalesSummary } from "@/types/sale";
import { 
  DollarSign, 
  CreditCard, 
  ShoppingCart, 
  TrendingUp,
  Users,
  Percent,
  BarChart3
} from "lucide-react";
import { StatsCard } from "./stats-card";

interface SalesStatsProps {
  summary: SalesSummary;
}

export function SalesStats({ summary }: SalesStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCompact = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(summary.total_revenue),
      description: "Gross revenue collected",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      delay: 0
    },
    {
      title: "Total Transactions",
      value: formatCompact(summary.total_sales),
      description: "Number of sales",
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      delay: 0.1
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(summary.average_sale_value),
      description: "Average per transaction",
      icon: CreditCard,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      delay: 0.2
    },
    {
      title: "Tax Collected",
      value: formatCurrency(summary.total_tax),
      description: "Total tax amount",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      delay: 0.3
    },
    {
      title: "Discount Given",
      value: formatCurrency(summary.total_discount),
      description: "Total discounts applied",
      icon: Percent,
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950",
      delay: 0.4
    },
    {
      title: "Net Sales",
      value: formatCurrency(summary.total_revenue - summary.total_discount),
      description: "Revenue after discounts",
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      delay: 0.5
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
}