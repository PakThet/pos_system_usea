'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Customer } from "@/types/customer";
import { CustomerAvatar } from "./customer-avatar";
import { Edit, Mail, Phone, MapPin, Calendar } from "lucide-react";
import { CustomerStatusBadge, CustomerTierBadge } from "./customer-badge";

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
  onEdit,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-US", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(new Date(date));

  const primaryAddress = Array.isArray(customer.addresses) 
    ? customer.addresses.find(addr => addr.is_primary) || customer.addresses[0]
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customer Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <CustomerAvatar
              customer={{
                firstName: customer.first_name,
                lastName: customer.last_name,
                avatar: customer.avatar || undefined,
              }}
              className="h-16 w-16"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">
                  {customer.first_name} {customer.last_name}
                </h2>
                <CustomerStatusBadge status={customer.status} />
                <CustomerTierBadge tier={customer.tier} />
              </div>
              <p className="text-muted-foreground">
                Customer since {formatDate(customer.created_at)}
              </p>
            </div>
            <Button onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{customer.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Statistics */}
            <div className="space-y-4">
              <h3 className="font-semibold">Order Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Orders</span>
                  <span className="font-semibold">{customer.total_orders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Spent</span>
                  <span className="font-semibold">{formatCurrency(customer.total_spent)}</span>
                </div>
                {customer.last_order && (
                  <div className="flex justify-between items-center">
                    <span>Last Order</span>
                    <span className="font-semibold">{formatDate(customer.last_order)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          {primaryAddress && (
            <div className="space-y-4">
              <h3 className="font-semibold">Address</h3>
              <div className="flex items-start gap-3 p-4 border rounded-lg">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p className="font-medium">{primaryAddress.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {primaryAddress.city}, {primaryAddress.state} {primaryAddress.zip_code}
                  </p>
                  <p className="text-sm text-muted-foreground">{primaryAddress.country}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}