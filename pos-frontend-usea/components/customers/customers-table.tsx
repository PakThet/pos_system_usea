'use client';

import { useState } from "react";
import { motion } from "framer-motion";
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
import { CustomerAvatar } from "./customer-avatar";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Mail,
  Phone,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { Customer } from "@/types/customer";
import { CustomerStatusBadge, CustomerTierBadge } from "./customer-badge";

interface CustomersTableProps {
  customers: Customer[];
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onContact: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
  isLoading?: boolean;
}

export function CustomersTable({
  customers,
  onView,
  onEdit,
  onContact,
  onDelete,
  isLoading,
}: CustomersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    const matchesTier = tierFilter === "all" || customer.tier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));

  return (
    <div className="space-y-4 p-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right">Total Spent</TableHead>
              <TableHead className="w-[80px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No customers found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b hover:bg-muted/50 cursor-pointer"
                  onClick={() => onView(customer)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <CustomerAvatar
                        customer={{
                          firstName: customer.first_name,
                          lastName: customer.last_name,
                          avatar: customer.avatar || undefined,
                        }}
                      />
                      <div>
                        <div className="font-semibold">
                          {customer.first_name} {customer.last_name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Joined {formatDate(customer.created_at)}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <CustomerStatusBadge status={customer.status} size="sm" />
                  </TableCell>

                  <TableCell>
                    <CustomerTierBadge tier={customer.tier} size="sm" />
                  </TableCell>

                  <TableCell>
                    <div className="font-medium">{customer.total_orders}</div>
                    {customer.last_order && (
                      <div className="text-xs text-muted-foreground">
                        Last: {formatDate(customer.last_order)}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    {formatCurrency(customer.total_spent)}
                  </TableCell>

                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onView(customer)}>
                          <Eye className="h-4 w-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEdit(customer)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onContact(customer)}>
                          <Mail className="h-4 w-4 mr-2" /> Send Email
                        </DropdownMenuItem>
                        {customer.phone && (
                          <DropdownMenuItem onClick={() => onContact(customer)}>
                            <Phone className="h-4 w-4 mr-2" /> Call Customer
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => onDelete(customer)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Customer
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}