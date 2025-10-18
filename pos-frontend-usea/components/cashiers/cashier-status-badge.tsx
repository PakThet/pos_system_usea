import { Badge } from "@/components/ui/badge";
import { CashierStatus, CashierRole, CashierShift } from "@/types/cashier";
import { CheckCircle, XCircle, Coffee, User, Star, Crown, Sun, Moon, Clock } from "lucide-react";

interface CashierStatusBadgeProps {
  status: CashierStatus;
  size?: "sm" | "default";
}

interface CashierRoleBadgeProps {
  role: CashierRole;
  size?: "sm" | "default";
}

interface CashierShiftBadgeProps {
  shift: CashierShift;
  size?: "sm" | "default";
}

export function CashierStatusBadge({ status, size = "default" }: CashierStatusBadgeProps) {
  const statusConfig = {
    active: { 
      label: "Active", 
      variant: "default" as const, 
      icon: CheckCircle,
      color: "text-green-500"
    },
    inactive: { 
      label: "Inactive", 
      variant: "secondary" as const, 
      icon: XCircle,
      color: "text-gray-500"
    },
    'on-break': { 
      label: "On Break", 
      variant: "outline" as const, 
      icon: Coffee,
      color: "text-orange-500"
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

export function CashierRoleBadge({ role, size = "default" }: CashierRoleBadgeProps) {
  const roleConfig = {
    cashier: { 
      label: "Cashier", 
      variant: "outline" as const, 
      icon: User,
      color: "text-blue-500"
    },
    'senior-cashier': { 
      label: "Senior Cashier", 
      variant: "secondary" as const, 
      icon: Star,
      color: "text-purple-500"
    },
    'head-cashier': { 
      label: "Head Cashier", 
      variant: "default" as const, 
      icon: Crown,
      color: "text-yellow-500"
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}

export function CashierShiftBadge({ shift, size = "default" }: CashierShiftBadgeProps) {
  const shiftConfig = {
    morning: { 
      label: "Morning", 
      variant: "outline" as const, 
      icon: Sun,
      color: "text-yellow-500"
    },
    afternoon: { 
      label: "Afternoon", 
      variant: "outline" as const, 
      icon: Sun,
      color: "text-orange-500"
    },
    evening: { 
      label: "Evening", 
      variant: "outline" as const, 
      icon: Moon,
      color: "text-blue-500"
    },
    night: { 
      label: "Night", 
      variant: "outline" as const, 
      icon: Moon,
      color: "text-indigo-500"
    },
  };

  const config = shiftConfig[shift];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}