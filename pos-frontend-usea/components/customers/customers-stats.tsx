import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerStats } from "@/types/customer";
import { 
  Users, 
  UserCheck, 
  UserX, 
  Crown, 
  Star,
  TrendingUp,
  DollarSign
} from "lucide-react";

interface CustomersStatsProps {
  stats: CustomerStats;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
export function CustomersStats({ stats }: CustomersStatsProps) {
  const statCards = [
    {
      title: "Total Customers",
      value: stats.total,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "All time customers"
    },
    {
      title: "Active Customers",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Currently active"
    },
    {
      title: "New This Month",
      value: stats.new_this_month,
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "New signups"
    },
    {
      title: "VIP Customers",
      value: stats.vip,
      icon: Crown,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "VIP tier customers"
    },
    {
      title: "Premium",
      value: stats.premium,
      icon: Star,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      description: "Premium tier"
    },
    {
      title: "Avg Order Value",
      value: formatCurrency(stats.average_order_value),
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      description: "Average spend"
    },
  ];

  return (
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
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}