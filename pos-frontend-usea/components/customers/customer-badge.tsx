'use client';

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Crown, Star, User } from "lucide-react";

export type CustomerStatus = "active" | "inactive";
export type CustomerTier = "standard" | "premium" | "vip";

interface CustomerStatusBadgeProps {
  status: CustomerStatus;
  size?: "sm" | "default";
}

interface CustomerTierBadgeProps {
  tier: CustomerTier;
  size?: "sm" | "default";
}

const statusConfig: Record<
  CustomerStatus,
  { label: string; variant: "default" | "secondary"; icon: React.FC<any>; color: string }
> = {
  active: { label: "Active", variant: "default", icon: CheckCircle, color: "text-green-500" },
  inactive: { label: "Inactive", variant: "secondary", icon: XCircle, color: "text-gray-500" },
};

const tierConfig: Record<
  CustomerTier,
  { label: string; variant: "default" | "secondary" | "outline"; icon: React.FC<any>; color: string }
> = {
  standard: { label: "Standard", variant: "outline", icon: User, color: "text-blue-500" },
  premium: { label: "Premium", variant: "secondary", icon: Star, color: "text-purple-500" },
  vip: { label: "VIP", variant: "default", icon: Crown, color: "text-yellow-500" },
};

export function CustomerStatusBadge({ status, size = "default" }: CustomerStatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig["inactive"];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    </motion.div>
  );
}

export function CustomerTierBadge({ tier, size = "default" }: CustomerTierBadgeProps) {
  const config = tierConfig[tier] ?? tierConfig["standard"];
  const Icon = config.icon;

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Badge variant={config.variant} className={`gap-1 ${size === "sm" ? "text-xs" : ""}`}>
        <Icon className={`h-3 w-3 ${config.color}`} />
        {config.label}
      </Badge>
    </motion.div>
  );
}