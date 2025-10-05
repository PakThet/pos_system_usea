import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CashierStats } from "@/types/cashier";
import { 
  Users, 
  UserCheck, 
  Coffee, 
  DollarSign,
  CreditCard,
  TrendingUp
} from "lucide-react";

interface CashiersStatsProps {
  stats: CashierStats;
}

export function CashiersStats({ stats }: CashiersStatsProps) {
  const statCards = [
    {
      title: "Total Cashiers",
      value: stats.total,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "All cashiers"
    },
    {
      title: "Active Now",
      value: stats.active,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Currently working"
    },
    {
      title: "On Break",
      value: stats.onBreak,
      icon: Coffee,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      description: "Taking breaks"
    },
    {
      title: "Total Sales",
      value: `$${stats.totalSales.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      description: "Today's sales"
    },
    {
      title: "Transactions",
      value: stats.totalTransactions,
      icon: CreditCard,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Today's transactions"
    },
    {
      title: "Avg Transaction",
      value: `$${stats.averageTransaction}`,
      icon: TrendingUp,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      description: "Average per transaction"
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