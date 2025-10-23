"use client";

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
import { Sale } from "@/types/sale";
import { 
  MoreHorizontal, 
  Eye, 
  Receipt,
  CreditCard,
  DollarSign,
  Smartphone,
  Wallet,
  User
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

interface RecentSalesProps {
  sales: Sale[];
  onViewDetails: (sale: Sale) => void;
  onRefund: (sale: Sale) => void;
}

export function RecentSales({ sales, onViewDetails, onRefund }: RecentSalesProps) {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(parseFloat(amount));
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="border-0 rounded-lg shadow-lg bg-gradient-to-br from-background to-muted/20 overflow-hidden">
        <div className="p-6 border-b bg-card/50">
          <h3 className="font-semibold text-xl flex items-center gap-2">
            <Receipt className="h-5 w-5 text-primary" />
            Recent Transactions
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="font-semibold">Transaction</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Payment</TableHead>
                <TableHead className="font-semibold">Items</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Amount</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <motion.tbody
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {sales.map((sale, index) => (
                <motion.tr
                  key={sale.id}
                  variants={rowVariants}
                  className="border-b hover:bg-accent/50 transition-colors group"
                  whileHover={{ scale: 1.005 }}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Receipt className="h-3 w-3 text-muted-foreground" />
                      <span className="font-mono text-sm">{sale.transaction_id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {sale.customer ? (
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {sale.customer.first_name} {sale.customer.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {sale.customer.email}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">Walk-in Customer</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(sale.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPaymentIcon(sale.payment_method)}
                      <span className="capitalize text-sm font-medium">{sale.payment_method}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {sale.items.length} item{sale.items.length !== 1 ? 's' : ''}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusVariant(sale.status)} 
                      className="font-medium"
                    >
                      {sale.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-bold text-lg text-green-600">
                    {formatCurrency(sale.total_amount)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => onViewDetails(sale)} className="cursor-pointer">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {sale.status === 'completed' && (
                          <DropdownMenuItem onClick={() => onRefund(sale)} className="cursor-pointer text-destructive">
                            <Receipt className="h-4 w-4 mr-2" />
                            Process Refund
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))}
            </motion.tbody>
          </Table>
        </div>

        {sales.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-muted-foreground text-lg">
              No sales transactions found.
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}