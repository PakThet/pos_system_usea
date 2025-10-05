"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesTrend } from "@/types/sales";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
  data: SalesTrend[];
  period: string;
}

export function SalesChart({ data, period }: SalesChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Simple bar chart implementation
  const maxSales = Math.max(...data.map(item => item.sales));
  const maxTransactions = Math.max(...data.map(item => item.transactions));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Sales Trend - {period}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Sales Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Sales Amount</span>
              <span className="text-muted-foreground">
                Total: {formatCurrency(data.reduce((sum, item) => sum + item.sales, 0))}
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-32">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                    style={{ 
                      height: `${(item.sales / maxSales) * 80}%`,
                      minHeight: '4px'
                    }}
                  />
                  <span className="text-xs mt-2 text-muted-foreground">
                    {item.date}
                  </span>
                  <span className="text-xs font-medium">
                    {formatCurrency(item.sales)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transactions Line */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Transactions</span>
              <span className="text-muted-foreground">
                Total: {data.reduce((sum, item) => sum + item.transactions, 0)}
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20">
              {data.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-1 bg-green-500 rounded-t transition-all duration-300 hover:bg-green-600"
                    style={{ 
                      height: `${(item.transactions / maxTransactions) * 60}%`,
                      minHeight: '2px'
                    }}
                  />
                  <span className="text-xs mt-1">
                    {item.transactions}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Sales Amount</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Transactions</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}