import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopProduct } from "@/types/sales";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TopProductsProps {
  products: TopProduct[];
}

export function TopProducts({ products }: TopProductsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{product.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {product.category}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-semibold">{formatCurrency(product.revenue)}</div>
                <div className="flex items-center gap-1 text-xs">
                  {product.growth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={product.growth >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {Math.abs(product.growth).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">
                    {product.quantity} sold
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}