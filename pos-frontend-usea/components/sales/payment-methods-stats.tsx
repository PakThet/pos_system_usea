import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PaymentMethodStats } from "@/types/sale";
import { CreditCard, DollarSign, Smartphone, Wallet } from "lucide-react";

interface PaymentMethodsStatsProps {
  stats: PaymentMethodStats[];
}

export function PaymentMethodsStats({ stats }: PaymentMethodsStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getIcon = (method: string) => {
    switch (method) {
      case 'cash': return <DollarSign className="h-4 w-4" />;
      case 'card': return <CreditCard className="h-4 w-4" />;
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'credit': return <Wallet className="h-4 w-4" />;
      default: return <CreditCard className="h-4 w-4" />;
    }
  };

  const getColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-500';
      case 'card': return 'bg-blue-500';
      case 'mobile': return 'bg-purple-500';
      case 'credit': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stats.map((stat) => (
            <div key={stat.method} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getIcon(stat.method)}
                  <span className="font-medium capitalize">{stat.method}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(stat.amount)}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.count} transactions
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={stat.percentage} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12">
                  {stat.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}