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
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    confirmed: { 
      label: "Confirmed", 
      variant: "secondary" as const, 
      icon: CheckCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200"
    },
    processing: { 
      label: "Processing", 
      variant: "secondary" as const, 
      icon: Package,
      color: "text-purple-500",
      bgColor: "bg-purple-50 border-purple-200"
    },
    shipped: { 
      label: "Shipped", 
      variant: "outline" as const, 
      icon: Truck,
      color: "text-orange-500",
      bgColor: "bg-orange-50 border-orange-200"
    },
    delivered: { 
      label: "Delivered", 
      variant: "outline" as const, 
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200"
    },
    cancelled: { 
      label: "Cancelled", 
      variant: "outline" as const, 
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200"
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`gap-1 ${size === "sm" ? "text-xs" : ""} ${config.bgColor}`}
    >
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
      color: "text-yellow-500",
      bgColor: "bg-yellow-50 border-yellow-200"
    },
    paid: { 
      label: "Paid", 
      variant: "outline" as const, 
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 border-green-200"
    },
    failed: { 
      label: "Failed", 
      variant: "outline" as const,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 border-red-200"
    },
    refunded: { 
      label: "Refunded", 
      variant: "secondary" as const, 
      icon: CreditCard,
      color: "text-blue-500",
      bgColor: "bg-blue-50 border-blue-200"
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant={config.variant} 
      className={`gap-1 ${size === "sm" ? "text-xs" : ""} ${config.bgColor}`}
    >
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}