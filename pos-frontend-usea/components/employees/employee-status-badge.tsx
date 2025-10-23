import { Badge } from "@/components/ui/badge";
import { EmployeeStatus, EmployeeRole, EmployeeShift } from "@/types/employee";
import { CheckCircle, XCircle, Coffee, User, Star, Crown, Sun, Moon } from "lucide-react";

interface EmployeeStatusBadgeProps {
  status: EmployeeStatus;
  size?: "sm" | "default";
}

interface EmployeeRoleBadgeProps {
  role: EmployeeRole;
  size?: "sm" | "default";
}

interface EmployeeShiftBadgeProps {
  shift: EmployeeShift;
  size?: "sm" | "default";
}

export function EmployeeStatusBadge({ status, size = "default" }: EmployeeStatusBadgeProps) {
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

export function EmployeeRoleBadge({ role, size = "default" }: EmployeeRoleBadgeProps) {
  const roleConfig = {
    admin: { 
      label: "Admin", 
      variant: "destructive" as const, 
      icon: Crown,
      color: "text-red-500"
    },
    manager: { 
      label: "Manager", 
      variant: "default" as const, 
      icon: User,
      color: "text-blue-500"
    },
    cashier: { 
      label: "Cashier", 
      variant: "outline" as const, 
      icon: User,
      color: "text-green-500"
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

export function EmployeeShiftBadge({ shift, size = "default" }: EmployeeShiftBadgeProps) {
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