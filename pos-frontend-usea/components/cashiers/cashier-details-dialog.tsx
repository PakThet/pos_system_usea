import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cashier } from "@/types/cashier";
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
  User
} from "lucide-react";

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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <CashierAvatar cashier={cashier} className="h-12 w-12" />
              <div>
                <div className="text-xl">{cashier.firstName} {cashier.lastName}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Employee ID: {cashier.employeeId}
                </div>
              </div>
            </DialogTitle>
            <Button variant="outline" onClick={() => onEdit(cashier)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Sales</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(cashier.totalSales)}</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Transactions</span>
                </div>
                <div className="text-2xl font-bold">{cashier.totalTransactions}</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Hours Worked</span>
                </div>
                <div className="text-2xl font-bold">{cashier.totalHours}h</div>
              </div>
            </div>

            {/* Status & Role */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold">Status</h3>
                </div>
                <CashierStatusBadge status={cashier.status} />
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <h3 className="font-semibold">Role</h3>
                </div>
                <CashierRoleBadge role={cashier.role} />
              </div>
              <div className="border rounded-lg p-4">
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

            {/* Permissions */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {cashier.permissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="text-xs">
                    {permission.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Notes */}
            {cashier.notes && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-sm text-muted-foreground">{cashier.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{cashier.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{cashier.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Details */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4" />
                <h3 className="font-semibold">Employment Details</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly Rate:</span>
                  <span className="font-medium">{formatCurrency(cashier.hourlyRate)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{formatDate(cashier.createdAt)}</span>
                </div>
                {cashier.lastLogin && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>{formatDate(cashier.lastLogin)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}