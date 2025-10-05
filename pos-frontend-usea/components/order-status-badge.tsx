import { Badge } from "@/components/ui/badge";
import { OrderStatus, PaymentStatus } from "@/types/order";
import { 
  Clock, 
  CheckCircle, 
  Truck, 
  Package, 
  XCircle, 
  CreditCard,
  AlertCircle 
} from "lucide-react";

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: "sm" | "default";
}

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "default";
}

export function OrderStatusBadge({ status, size = "default" }: OrderStatusBadgeProps) {
  const statusConfig = {
    pending: { 
      label: "Pending", 
      variant: "outline" as const, 
      icon: Clock,
      color: "text-yellow-500"
    },
    confirmed: { 
      label: "Confirmed", 
      variant: "secondary" as const, 
      icon: CheckCircle,
      color: "text-blue-500"
    },
    processing: { 
      label: "Processing", 
      variant: "secondary" as const, 
      icon: Package,
      color: "text-purple-500"
    },
    shipped: { 
      label: "Shipped", 
      variant: "default" as const, 
      icon: Truck,
      color: "text-orange-500"
    },
    delivered: { 
      label: "Delivered", 
      variant: "default" as const, 
      icon: CheckCircle,
      color: "text-green-500"
    },
    cancelled: { 
      label: "Cancelled", 
      variant: "destructive" as const, 
      icon: XCircle,
      color: "text-red-500"
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}

export function PaymentStatusBadge({ status, size = "default" }: PaymentStatusBadgeProps) {
  const statusConfig = {
    pending: { 
      label: "Pending", 
      variant: "outline" as const, 
      icon: Clock,
      color: "text-yellow-500"
    },
    paid: { 
      label: "Paid", 
      variant: "default" as const, 
      icon: CheckCircle,
      color: "text-green-500"
    },
    failed: { 
      label: "Failed", 
      variant: "destructive" as const, 
      icon: XCircle,
      color: "text-red-500"
    },
    refunded: { 
      label: "Refunded", 
      variant: "secondary" as const, 
      icon: CreditCard,
      color: "text-blue-500"
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}