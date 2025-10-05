import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerAvatarProps {
  customer: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  className?: string;
}

export function CustomerAvatar({ customer, className }: CustomerAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Avatar className={className}>
      <AvatarImage src={customer.avatar} alt={`${customer.firstName} ${customer.lastName}`} />
      <AvatarFallback>
        {getInitials(customer.firstName, customer.lastName)}
      </AvatarFallback>
    </Avatar>
  );
}