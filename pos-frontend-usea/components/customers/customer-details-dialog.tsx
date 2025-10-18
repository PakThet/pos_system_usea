import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  Edit,
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
  onEdit,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  const formatCurrency = (amount?: number | string): string =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount ?? 0));

  const formatDate = (date?: string | Date): string => {
    if (!date) return "N/A";
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) return "Invalid Date";
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(parsed);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-lg bg-white">
        {/* Header */}
        <DialogHeader className="flex items-center justify-between border-b pb-4 mb-6">
          <div className="flex items-center gap-4">
            <CustomerAvatar
              customer={{
                firstName: customer.first_name ?? "",
                lastName: customer.last_name ?? "",
                avatar: customer.avatar,
              }}
              className="h-12 w-12"
            />
            <div>
              <DialogTitle className="text-xl font-semibold leading-none">
                {customer.first_name} {customer.last_name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Customer since {formatDate(customer.created_at)}
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="grid grid-cols-1 gap-8">
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
      {
        label: "Total Orders",
        icon: <Package className="h-6 w-6 text-indigo-500" />,
        value: customer.total_orders ?? 0,
      },
      {
        label: "Total Spent",
        icon: <DollarSign className="h-6 w-6 text-green-500" />,
        value: formatCurrency(customer.total_spent),
      },
      {
        label: "Last Order",
        icon: <Calendar className="h-6 w-6 text-yellow-500" />,
        value: customer.last_order ? formatDate(customer.last_order) : "No orders",
      },
    ].map((stat, i) => (
      <div
        key={i}
        className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-center gap-2 mb-2 text-gray-500">
          {stat.icon}
          <span className="text-sm font-medium">{stat.label}</span>
        </div>
        <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
      </div>
    ))}
  </div>

  {/* Contact Info */}
  <div className="border rounded-2xl p-6 bg-gray-50 shadow-sm">
    <h3 className="text-lg font-semibold mb-4 text-gray-800">
      Contact Information
    </h3>
    <div className="space-y-4">
      {customer.email && (
        <div className="flex items-start gap-4">
          <Mail className="h-5 w-5 text-indigo-500 mt-1" />
          <div>
            <div className="text-sm font-medium text-gray-700">Email</div>
            <div className="text-sm text-gray-600 break-all">{customer.email}</div>
          </div>
        </div>
      )}
      {customer.phone && (
        <div className="flex items-start gap-4">
          <Phone className="h-5 w-5 text-green-500 mt-1" />
          <div>
            <div className="text-sm font-medium text-gray-700">Phone</div>
            <div className="text-sm text-gray-600">{customer.phone}</div>
          </div>
        </div>
      )}
    </div>
  </div>
</div>


        {/* Bottom Section */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Status */}
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Account Status
            </h3>
            <CustomerStatusBadge status={customer.status} />
          </div>

          {/* Customer Tier */}
          <div className="border rounded-xl p-6 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Customer Tier
            </h3>
            <CustomerTierBadge tier={customer.tier} />
          </div>

          {/* Address */}
          {customer.address && (
            <div className="border rounded-xl p-6 bg-gray-50 lg:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-gray-500" />
                <h3 className="text-sm font-semibold text-gray-700">Address</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {customer.address.street}
                <br />
                {customer.address.city}, {customer.address.state} {customer.address.zip_code}
                <br />
                {customer.address.country}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
