"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cashier } from "@/types/cashier";

interface CashierAvatarProps {
  cashier: Cashier;
  className?: string;
}

export function CashierAvatar({ cashier, className }: CashierAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Avatar className={className}>
      {cashier.avatar && <AvatarImage src={cashier.avatar} alt={`${cashier.first_name} ${cashier.last_name}`} />}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(cashier.first_name, cashier.last_name)}
      </AvatarFallback>
    </Avatar>
  );
}
