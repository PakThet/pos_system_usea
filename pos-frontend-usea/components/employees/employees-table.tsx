import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Employee } from "@/types/employee";
import { EmployeeAvatar } from "./employee-avatar";
import { EmployeeStatusBadge, EmployeeRoleBadge, EmployeeShiftBadge } from "./employee-status-badge";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  Search,
  Filter,
  Clock,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmployeesTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employeeId: string) => Promise<void>;
  onStatusChange: (employeeId: string, status: Employee['status']) => Promise<void>;
  onRecordLogin: (employeeId: string) => Promise<void>;
  isLoading?: boolean;
}

// Delete Confirmation Dialog
function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  description = "Are you sure you want to delete this item?",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-[400px]">
        <CardHeader className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{description}</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button variant="destructive" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmployeesTable({
  employees,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onRecordLogin,
  isLoading = false,
}: EmployeesTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    const matchesRole = roleFilter === "all" || employee.role === roleFilter;
    const matchesShift = shiftFilter === "all" || employee.shift === shiftFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesShift;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const handleStatusToggle = async (employee: Employee, checked: boolean) => {
    await onStatusChange(employee.id, checked ? "active" : "inactive");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search employees by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="on-break">On Break</SelectItem>
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="cashier">Cashier</SelectItem>
            <SelectItem value="senior-cashier">Senior</SelectItem>
            <SelectItem value="head-cashier">Head</SelectItem>
          </SelectContent>
        </Select>
        <Select value={shiftFilter} onValueChange={setShiftFilter}>
          <SelectTrigger className="w-[150px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Shift" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Shifts</SelectItem>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Shift</TableHead>
              <TableHead className="text-right">Sales</TableHead>
              <TableHead className="w-[100px]">Active</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <EmployeeAvatar employee={employee} />
                    <div>
                      <div className="font-semibold">{employee.first_name} {employee.last_name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${employee.hourly_rate}/hr
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{employee.employee_id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{employee.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <EmployeeStatusBadge status={employee.status} size="sm" />
                </TableCell>
                <TableCell>
                  <EmployeeRoleBadge role={employee.role} size="sm" />
                </TableCell>
                <TableCell>
                  <EmployeeShiftBadge shift={employee.shift} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-semibold">{formatCurrency(employee.total_sales)}</div>
                  <div className="text-xs text-muted-foreground">
                    {employee.total_transactions} transactions
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={employee.status === "active"}
                    onCheckedChange={(checked) => handleStatusToggle(employee, checked)}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onView(employee)}>
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(employee)}>
                        <Edit className="h-4 w-4 mr-2" /> Edit Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRecordLogin(employee.id)}>
                        <Clock className="h-4 w-4 mr-2" /> Record Login
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          setEmployeeToDelete(employee);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Employee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No employees found matching your criteria.</div>
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (employeeToDelete) {
            await onDelete(employeeToDelete.id);
            setEmployeeToDelete(null);
          }
        }}
        title="Delete Employee"
        description={`Are you sure you want to delete employee ${employeeToDelete?.first_name} ${employeeToDelete?.last_name}?`}
      />
    </div>
  );
}