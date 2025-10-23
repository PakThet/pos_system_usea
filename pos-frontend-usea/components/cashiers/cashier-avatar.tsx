"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cashier } from "@/types/order";
import { motion } from "framer-motion";

interface CashierAvatarProps {
  cashier: Cashier;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CashierAvatar({ cashier, className = "", size = "md" }: CashierAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  };

  return (
    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <Avatar className={`${sizeClasses[size]} ${className} border-2 border-primary/20`}>
        {cashier.avatar && (
          <AvatarImage 
            src={cashier.avatar} 
            alt={`${cashier.first_name} ${cashier.last_name}`}
            className="object-cover"
          />
        )}
        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-semibold shadow-lg">
          {getInitials(cashier.first_name, cashier.last_name)}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}