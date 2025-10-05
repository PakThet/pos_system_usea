import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sale } from "@/types/sales";
import { 
  MoreHorizontal, 
  Eye, 
  Receipt,
  CreditCard,
  DollarSign,
  Smartphone,
  Wallet
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentSalesProps {
  sales: Sale[];
  onViewDetails: (sale: Sale) => void;
  onRefund: (sale: Sale) => void;
}

export function RecentSales({ sales, onViewDetails, onRefund }: RecentSalesProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <DollarSign className="h-3 w-3" />;
      case 'card': return <CreditCard className="h-3 w-3" />;
      case 'mobile': return <Smartphone className="h-3 w-3" />;
      case 'credit': return <Wallet className="h-3 w-3" />;
      default: return <CreditCard className="h-3 w-3" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'refunded': return 'outline';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Recent Transactions</h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Receipt className="h-3 w-3 text-muted-foreground" />
                  {sale.transactionId}
                </div>
              </TableCell>
              <TableCell>
                {sale.customer ? (
                  <div>
                    <div className="font-medium">{sale.customer.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {sale.customer.email}
                    </div>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Walk-in</span>
                )}
              </TableCell>
              <TableCell>{formatDate(sale.createdAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getPaymentIcon(sale.paymentMethod)}
                  <span className="capitalize">{sale.paymentMethod}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(sale.status)}>
                  {sale.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-semibold">
                {formatCurrency(sale.totalAmount)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetails(sale)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    {sale.status === 'completed' && (
                      <DropdownMenuItem onClick={() => onRefund(sale)}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Process Refund
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {sales.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            No sales transactions found.
          </div>
        </div>
      )}
    </div>
  );
}