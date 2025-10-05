import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Customer } from "@/types/customer";
import { CustomerAvatar } from "./customer-avatar";
import { CustomerStatusBadge, CustomerTierBadge } from "./customer-status-badge";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Package,
  DollarSign,
  Edit 
} from "lucide-react";

interface CustomerDetailsDialogProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetailsDialog({ 
  customer, 
  open, 
  onOpenChange, 
  onEdit 
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

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
    }).format(date);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <CustomerAvatar customer={customer} className="h-10 w-10" />
              <div>
                <div>{customer.firstName} {customer.lastName}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  Customer since {formatDate(customer.createdAt)}
                </div>
              </div>
            </DialogTitle>
            <Button variant="outline" onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Orders</span>
                </div>
                <div className="text-2xl font-bold">{customer.totalOrders}</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Total Spent</span>
                </div>
                <div className="text-2xl font-bold">{formatCurrency(customer.totalSpent)}</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Last Order</span>
                </div>
                <div className="text-sm font-medium">
                  {customer.lastOrder ? formatDate(customer.lastOrder) : 'No orders'}
                </div>
              </div>
            </div>

            {/* Status & Tier */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <h3 className="font-semibold">Account Status</h3>
                </div>
                <CustomerStatusBadge status={customer.status} />
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <h3 className="font-semibold">Customer Tier</h3>
                </div>
                <CustomerTierBadge tier={customer.tier} />
              </div>
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Notes</h3>
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
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
                    <div className="text-sm text-muted-foreground">{customer.email}</div>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Phone</div>
                      <div className="text-sm text-muted-foreground">{customer.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Address */}
            {customer.address && (
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4" />
                  <h3 className="font-semibold">Address</h3>
                </div>
                <div className="text-sm space-y-1">
                  <div>{customer.address.street}</div>
                  <div>
                    {customer.address.city}, {customer.address.state} {customer.address.zipCode}
                  </div>
                  <div>{customer.address.country}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}