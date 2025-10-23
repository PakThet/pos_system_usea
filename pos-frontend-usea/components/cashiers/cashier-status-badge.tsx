"use client";

import { Badge } from "@/components/ui/badge";
import { CashierStatus, CashierRole, CashierShift } from "@/types/employee";
import { CheckCircle, XCircle, Coffee, User, Star, Crown, Sun, Moon, Clock } from "lucide-react";
import { motion } from "framer-motion";

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
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900"
    },
    inactive: { 
      label: "Inactive", 
      variant: "secondary" as const, 
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900"
    },
    'on-break': { 
      label: "On Break", 
      variant: "outline" as const, 
      icon: Coffee,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge 
        variant={config.variant} 
        className={`gap-1 ${size === "sm" ? "text-xs px-2 py-1" : "px-3 py-1"} ${config.bgColor} border-0 shadow-sm`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    </motion.div>
  );
}

export function CashierRoleBadge({ role, size = "default" }: CashierRoleBadgeProps) {
  const roleConfig = {
    cashier: { 
      label: "Cashier", 
      variant: "outline" as const, 
      icon: User,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    'senior-cashier': { 
      label: "Senior Cashier", 
      variant: "secondary" as const, 
      icon: Star,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900"
    },
    'head-cashier': { 
      label: "Head Cashier", 
      variant: "default" as const, 
      icon: Crown,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900"
    },
  };

  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge 
        variant={config.variant} 
        className={`gap-1 ${size === "sm" ? "text-xs px-2 py-1" : "px-3 py-1"} ${config.bgColor} border-0 shadow-sm`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    </motion.div>
  );
}

export function CashierShiftBadge({ shift, size = "default" }: CashierShiftBadgeProps) {
  const shiftConfig = {
    morning: { 
      label: "Morning", 
      variant: "outline" as const, 
      icon: Sun,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900"
    },
    afternoon: { 
      label: "Afternoon", 
      variant: "outline" as const, 
      icon: Sun,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900"
    },
    evening: { 
      label: "Evening", 
      variant: "outline" as const, 
      icon: Moon,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900"
    },
    night: { 
      label: "Night", 
      variant: "outline" as const, 
      icon: Moon,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900"
    },
  };

  const config = shiftConfig[shift];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge 
        variant={config.variant} 
        className={`gap-1 ${size === "sm" ? "text-xs px-2 py-1" : "px-3 py-1"} ${config.bgColor} border-0 shadow-sm`}
      >
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    </motion.div>
  );
}