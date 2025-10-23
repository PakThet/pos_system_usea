import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStats } from "@/types/order";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface OrdersStatsProps {
  stats: OrderStats;
}

export function OrdersStats({ stats }: OrdersStatsProps) {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: Package,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Shipped",
      value: stats.shipped,
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
  ];

  const revenueCards = [
    {
      title: "Total Revenue",
      value: `$${stats.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Average Order",
      value: `$${stats.average_order_value.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
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
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {revenueCards.map((stat) => {
          const Icon = stat.icon;
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
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}