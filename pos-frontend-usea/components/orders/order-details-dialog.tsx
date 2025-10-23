import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/types/order";
import { OrderStatusBadge, PaymentStatusBadge } from "./order-status-badge";
import { 
  Package, 
  User, 
  MapPin, 
  CreditCard,
  Calendar,
  Truck,
  Store,
  UserCheck,
  Mail,
  Phone,
  Globe,
  FileText,
  DollarSign,
  Percent,
  TruckIcon,
  Download,
  Printer,
  Share2
} from "lucide-react";

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null;

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  const getCustomerName = (customer: Order['customer']) => {
    return `${customer.first_name} ${customer.last_name}`;
  };

  const getCashierName = (cashier: Order['cashier']) => {
    return `${cashier.first_name} ${cashier.last_name}`;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Export order:', order);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="p-2 bg-primary rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div>Order Details</div>
                <div className="text-lg font-normal text-muted-foreground">
                  {order.order_number}
                </div>
              </div>
            </DialogTitle>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Header Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
                  <Package className="h-4 w-4" />
                  Order Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  <OrderStatusBadge status={order.status} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
                  <CreditCard className="h-4 w-4" />
                  Payment Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold">
                  <PaymentStatusBadge status={order.payment_status} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700">
                  <Store className="h-4 w-4" />
                  Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-purple-800">{order.store.name}</div>
                <div className="text-sm text-purple-600 mt-1">{order.store.location}</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50 border-orange-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-700">
                  <UserCheck className="h-4 w-4" />
                  Cashier
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-semibold text-orange-800">{getCashierName(order.cashier)}</div>
                <div className="text-sm text-orange-600 mt-1">{order.cashier.employee_id}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Order Items & Summary */}
            <div className="xl:col-span-2 space-y-6">
              {/* Order Items */}
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5" />
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4 p-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <img
                              src={item.product.image || "/placeholder-product.jpg"}
                              alt={item.product_name}
                              className="w-16 h-16 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                              }}
                            />
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-2 -right-2 bg-primary text-primary-foreground"
                            >
                              {item.quantity}
                            </Badge>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-lg">{item.product_name}</div>
                            <div className="text-sm text-muted-foreground space-y-1 mt-1">
                              <div>SKU: {item.product.sku}</div>
                              <div>Price: {formatCurrency(item.price)} each</div>
                              {item.product.barcode && (
                                <div>Barcode: {item.product.barcode}</div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-green-600">
                            {formatCurrency(item.total_price)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.quantity} × {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">{formatCurrency(order.subtotal_amount)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Tax
                      </span>
                      <span className="font-medium text-orange-600">{formatCurrency(order.tax_amount)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <TruckIcon className="h-4 w-4" />
                        Shipping
                      </span>
                      <span className="font-medium text-blue-600">{formatCurrency(order.shipping_amount)}</span>
                    </div>
                    
                    {parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Discount
                        </span>
                        <span className="font-medium text-red-600">-{formatCurrency(order.discount_amount)}</span>
                      </div>
                    )}

                    <Separator />

                    <div className="flex justify-between items-center text-2xl font-bold pt-2">
                      <span className="flex items-center gap-2">
                        <DollarSign className="h-6 w-6" />
                        Total Amount
                      </span>
                      <span className="text-green-600">{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Customer & Order Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {order.customer.first_name[0]}{order.customer.last_name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-lg">{getCustomerName(order.customer)}</div>
                      <Badge variant="outline" className="bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-200">
                        {order.customer.tier} Tier
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm text-blue-600">Email</div>
                        <div className="font-medium">{order.customer.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <Phone className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm text-green-600">Phone</div>
                        <div className="font-medium">{order.customer.phone}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-muted-foreground">Total Orders</div>
                        <div className="font-bold text-lg">{order.customer.total_orders}</div>
                      </div>
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="text-muted-foreground">Total Spent</div>
                        <div className="font-bold text-lg">{formatCurrency(order.customer.total_spent)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <h4 className="font-semibold text-blue-700">Shipping Address</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">{order.shipping_address.street}</div>
                        <div className="text-muted-foreground">
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {order.shipping_address.country}
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 bg-white">
                      <div className="flex items-center gap-2 mb-3">
                        <CreditCard className="h-4 w-4 text-green-600" />
                        <h4 className="font-semibold text-green-700">Billing Address</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="font-medium">{order.billing_address.street}</div>
                        <div className="text-muted-foreground">
                          {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip_code}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Globe className="h-3 w-3" />
                          {order.billing_address.country}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardHeader className="bg-muted/30">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Calendar className="h-5 w-5" />
                    Order Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Order Created</span>
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        {formatDate(order.created_at)}
                      </div>
                    </div>

                    {order.estimated_delivery && (
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">Estimated Delivery</span>
                        </div>
                        <div className="text-sm text-blue-700 font-medium">
                          {formatDate(order.estimated_delivery)}
                        </div>
                      </div>
                    )}

                    {order.tracking_number && (
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-700">Tracking Number</span>
                        </div>
                        <div className="font-mono text-lg font-bold text-purple-800 bg-white p-2 rounded border">
                          {order.tracking_number}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <span className="font-medium">Last Updated</span>
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        {formatDate(order.updated_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}