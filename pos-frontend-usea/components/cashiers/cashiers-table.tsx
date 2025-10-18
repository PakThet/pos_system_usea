"use client";

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
import { Cashier } from "@/types/cashier";
import { CashierAvatar } from "./cashier-avatar";
import { CashierStatusBadge, CashierRoleBadge, CashierShiftBadge } from "./cashier-status-badge";
import { 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Mail,
  Phone,
  Search,
  Filter,
  Clock,
  DollarSign
} from "lucide-react";

interface CashiersTableProps {
  cashiers: Cashier[];
  onView: (cashier: Cashier) => void;
  onEdit: (cashier: Cashier) => void;
  onDelete: (cashierId: string) => Promise<void>;
  onStatusChange: (cashierId: string, status: Cashier['status']) => Promise<void>;
  onRecordLogin: (cashierId: string) => Promise<void>;
  isLoading?: boolean;
}

export function CashiersTable({
  cashiers,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
  onRecordLogin,
  isLoading = false,
}: CashiersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");

  const filteredCashiers = cashiers.filter((cashier) => {
    const matchesSearch =
      cashier.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cashier.employee_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || cashier.status === statusFilter;
    const matchesRole = roleFilter === "all" || cashier.role === roleFilter;
    const matchesShift = shiftFilter === "all" || cashier.shift === shiftFilter;

    return matchesSearch && matchesStatus && matchesRole && matchesShift;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const handleStatusToggle = async (cashier: Cashier, checked: boolean) => {
    await onStatusChange(cashier.id, checked ? "active" : "inactive");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cashiers by name, email, or ID..."
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
              <TableHead>Cashier</TableHead>
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
            {filteredCashiers.map((cashier) => (
              <TableRow key={cashier.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <CashierAvatar cashier={cashier} />
                    <div>
                      <div className="font-semibold">
                        {cashier.first_name} {cashier.last_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        ${cashier.hourly_rate}/hr
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{cashier.employee_id}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{cashier.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{cashier.phone}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <CashierStatusBadge status={cashier.status} size="sm" />
                </TableCell>
                <TableCell>
                  <CashierRoleBadge role={cashier.role} size="sm" />
                </TableCell>
                <TableCell>
                  <CashierShiftBadge shift={cashier.shift} size="sm" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-semibold">{formatCurrency(cashier.total_sales)}</div>
                  <div className="text-xs text-muted-foreground">
                    {cashier.total_transactions} transactions
                  </div>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={cashier.status === "active"}
                    onCheckedChange={(checked) => handleStatusToggle(cashier, checked)}
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
                      <DropdownMenuItem onClick={() => onView(cashier)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(cashier)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Cashier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRecordLogin(cashier.id)}>
                        <Clock className="h-4 w-4 mr-2" />
                        Record Login
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onDelete(cashier.id)}>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Delete Cashier
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredCashiers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">No cashiers found matching your criteria.</div>
          </div>
        )}
      </div>
    </div>
  );
}
