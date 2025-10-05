import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CashierAvatarProps {
  cashier: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  className?: string;
}

export function CashierAvatar({ cashier, className }: CashierAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={cashier.avatar} alt={`${cashier.firstName} ${cashier.lastName}`} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(cashier.firstName, cashier.lastName)}
      </AvatarFallback>
    </Avatar>
  );
}