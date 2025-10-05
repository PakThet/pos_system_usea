import { Badge } from "@/components/ui/badge";
import { CustomerStatus, CustomerTier } from "@/types/customer";
import { CheckCircle, XCircle, Crown, Star, User } from "lucide-react";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  size?: "sm" | "default";
}

interface CustomerTierBadgeProps {
  tier: CustomerTier;
  size?: "sm" | "default";
}

export function CustomerStatusBadge({ status, size = "default" }: CustomerStatusBadgeProps) {
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

export function CustomerTierBadge({ tier, size = "default" }: CustomerTierBadgeProps) {
  const tierConfig = {
    standard: { 
      label: "Standard", 
      variant: "outline" as const, 
      icon: User,
      color: "text-blue-500"
    },
    premium: { 
      label: "Premium", 
      variant: "secondary" as const, 
      icon: Star,
      color: "text-purple-500"
    },
    vip: { 
      label: "VIP", 
      variant: "default" as const, 
      icon: Crown,
      color: "text-yellow-500"
    },
  };

  const config = tierConfig[tier];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      {config.label}
    </Badge>
  );
}