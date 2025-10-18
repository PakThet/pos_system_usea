import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerAvatarProps {
  customer: {
    firstName?: string;
    lastName?: string;
    avatar?: string | null;
  };
  className?: string;
}

export function CustomerAvatar({ customer, className }: CustomerAvatarProps) {
  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) ?? "";
    const last = lastName?.charAt(0) ?? "";
    const initials = (first + last).toUpperCase();
    return initials || "?"; 
  };

  return (
    <Avatar className={className}>
      {customer.avatar ? (
        <AvatarImage
          src={customer.avatar}
          alt={`${customer.firstName ?? ""} ${customer.lastName ?? ""}`}
        />
      ) : null}
      <AvatarFallback>
        {getInitials(customer.firstName, customer.lastName)}
      </AvatarFallback>
    </Avatar>
  );
}
