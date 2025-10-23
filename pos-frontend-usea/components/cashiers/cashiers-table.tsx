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
import { Cashier } from "@/types/employee";
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
  Trash2,
  User,
  DollarSign
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cashierToDelete, setCashierToDelete] = useState<Cashier | null>(null);

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
    new Intl.NumberFormat("en-US", { 
      style: "currency", 
      currency: "USD",
      minimumFractionDigits: 0 
    }).format(amount);

  const handleStatusToggle = async (cashier: Cashier, checked: boolean) => {
    await onStatusChange(cashier.id, checked ? "active" : "inactive");
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-muted/20 to-muted/10 rounded-xl border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cashiers by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background/50 backdrop-blur-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px] bg-background/50 backdrop-blur-sm">
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
          <SelectTrigger className="w-[150px] bg-background/50 backdrop-blur-sm">
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
          <SelectTrigger className="w-[150px] bg-background/50 backdrop-blur-sm">
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
      </motion.div>

      {/* Table */}
      <motion.div 
        className="border-0 rounded-xl shadow-lg bg-gradient-to-br from-background to-muted/5 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="font-semibold">Cashier</TableHead>
              <TableHead className="font-semibold">Employee ID</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Role</TableHead>
              <TableHead className="font-semibold">Shift</TableHead>
              <TableHead className="font-semibold text-right">Performance</TableHead>
              <TableHead className="font-semibold text-center">Active</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredCashiers.map((cashier, index) => (
                <motion.tr
                  key={cashier.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  custom={index}
                  className="border-b hover:bg-accent/50 transition-colors group cursor-pointer"
                  whileHover={{ scale: 1.005, backgroundColor: "rgba(0,0,0,0.02)" }}
                >
                  <TableCell>
                    <div className="flex items-center gap-3" onClick={() => onView(cashier)}>
                      <CashierAvatar cashier={cashier} size="md" />
                      <div>
                        <div className="font-semibold group-hover:text-primary transition-colors">
                          {cashier.first_name} {cashier.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(cashier.hourly_rate)}/hr
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm bg-muted/20 rounded-lg px-3 py-2">
                    {cashier.employee_id}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{cashier.email}</span>
                      </div>
                      {cashier.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{cashier.phone}</span>
                        </div>
                      )}
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
                    <div className="font-bold text-lg text-green-600">
                      {formatCurrency(cashier.total_sales)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cashier.total_transactions} trans • {cashier.total_hours}h
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Switch
                        checked={cashier.status === "active"}
                        onCheckedChange={(checked) => handleStatusToggle(cashier, checked)}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </motion.div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(cashier)} className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(cashier)} className="cursor-pointer">
                          <Edit className="h-4 w-4 mr-2" /> Edit Cashier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onRecordLogin(cashier.id)} className="cursor-pointer">
                          <Clock className="h-4 w-4 mr-2" /> Record Login
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setCashierToDelete(cashier);
                            setDeleteDialogOpen(true);
                          }}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete Cashier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>

        {filteredCashiers.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground text-lg">No cashiers found matching your criteria.</div>
          </motion.div>
        )}
      </motion.div>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={async () => {
          if (cashierToDelete) {
            await onDelete(cashierToDelete.id);
            setCashierToDelete(null);
          }
        }}
        title="Delete Cashier"
        description={`Are you sure you want to delete cashier ${cashierToDelete?.first_name} ${cashierToDelete?.last_name}? This action cannot be undone.`}
      />
    </div>
  );
}