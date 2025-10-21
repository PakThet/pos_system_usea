import { Badge } from "@/components/ui/badge";

interface StockBadgeProps {
  quantity: number;
  alertLevel: number;
}

export const StockBadge = ({ quantity, alertLevel }: StockBadgeProps) => {
  const getStatus = () => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'destructive' };
    if (quantity <= alertLevel) return { label: 'Low Stock', color: 'warning' };
    return { label: 'In Stock', color: 'success' };
  };

  const status = getStatus();
  return <Badge variant={status.color as any}>{status.label}</Badge>;
};
