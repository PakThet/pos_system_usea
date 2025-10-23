"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cashier } from "@/types/employee";
import { CashierAvatar } from "./cashier-avatar";
import { CashierStatusBadge, CashierRoleBadge, CashierShiftBadge } from "./cashier-status-badge";
import { 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Edit,
  User,
  BarChart3,
  Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface CashierDetailsDialogProps {
  cashier: Cashier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (cashier: Cashier) => void;
}

export function CashierDetailsDialog({ 
  cashier, 
  open, 
  onOpenChange, 
  onEdit 
}: CashierDetailsDialogProps) {
  if (!cashier) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};


  const getShiftHours = (shift: string) => {
    const shiftHours = {
      morning: "6:00 AM - 2:00 PM",
      afternoon: "2:00 PM - 10:00 PM",
      evening: "4:00 PM - 12:00 AM",
      night: "10:00 PM - 6:00 AM",
    };
    return shiftHours[shift as keyof typeof shiftHours];
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-4">
                <CashierAvatar cashier={cashier} size="lg" />
                <div>
                  <div className="text-2xl font-bold">{cashier.first_name} {cashier.last_name}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    Employee ID: {cashier.employee_id}
                  </div>
                </div>
              </DialogTitle>
              <Button variant="outline" onClick={() => onEdit(cashier)} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          </DialogHeader>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Performance Stats */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-xl p-4 text-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Total Sales</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                      {formatCurrency(cashier.total_sales)}
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 text-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Transactions</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                      {cashier.total_transactions}
                    </div>
                  </div>
                  <div className="border rounded-xl p-4 text-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Hours Worked</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                      {cashier.total_hours}h
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Status & Role */}
              <motion.div variants={itemVariants}>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-xl p-4 bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold">Status</h3>
                    </div>
                    <CashierStatusBadge status={cashier.status} />
                  </div>
                  <div className="border rounded-xl p-4 bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Role</h3>
                    </div>
                    <CashierRoleBadge role={cashier.role} />
                  </div>
                  <div className="border rounded-xl p-4 bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h3 className="font-semibold">Shift</h3>
                    </div>
                    <CashierShiftBadge shift={cashier.shift} />
                    <div className="text-xs text-muted-foreground mt-1">
                      {getShiftHours(cashier.shift)}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Permissions */}
              <motion.div variants={itemVariants}>
                <div className="border rounded-xl p-4 bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Permissions</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cashier.permissions.map((permission) => (
                      <Badge key={permission} variant="secondary" className="text-xs">
                        {permission.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Notes */}
              {cashier.notes && (
                <motion.div variants={itemVariants}>
                  <div className="border rounded-xl p-4 bg-card">
                    <h3 className="font-semibold mb-3">Notes</h3>
                    <p className="text-sm text-muted-foreground">{cashier.notes}</p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <motion.div variants={itemVariants}>
                <div className="border rounded-xl p-4 bg-card">
                  <h3 className="font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">Email</div>
                        <div className="text-sm text-muted-foreground">{cashier.email}</div>
                      </div>
                    </div>
                    {cashier.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium">Phone</div>
                          <div className="text-sm text-muted-foreground">{cashier.phone}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Employment Details */}
              <motion.div variants={itemVariants}>
                <div className="border rounded-xl p-4 bg-card">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4" />
                    <h3 className="font-semibold">Employment Details</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hourly Rate:</span>
                      <span className="font-medium">{formatCurrency(cashier.hourly_rate)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Joined:</span>
                      <span>{formatDate(cashier.created_at)}</span>
                    </div>
                    {cashier.last_login_at && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Login:</span>
                        <span>{formatDate(cashier.last_login_at)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}