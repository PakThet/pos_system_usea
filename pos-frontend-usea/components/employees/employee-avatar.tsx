import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Employee } from "@/types/employee";

interface EmployeeAvatarProps {
  employee: Employee;
  className?: string;
}

export function EmployeeAvatar({ employee, className }: EmployeeAvatarProps) {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  return (
    <Avatar className={className}>
      {employee.avatar && <AvatarImage src={employee.avatar} alt={`${employee.first_name} ${employee.last_name}`} />}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitials(employee.first_name, employee.last_name)}
      </AvatarFallback>
    </Avatar>
  );
}