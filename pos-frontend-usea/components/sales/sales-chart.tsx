"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesTrend } from "@/types/sale";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Variants, easeOut } from "framer-motion";
interface SalesChartProps {
  data: SalesTrend[];
  period: string;
}

export function SalesChart({ data, period }: SalesChartProps) {
  // const { theme } = useTheme();
  // const isDark = theme === "dark";

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxSales = Math.max(...data.map(item => item.sales));
  const maxTransactions = Math.max(...data.map(item => item.transactions));

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};


  const itemVariants = {
    hidden: { opacity: 0, scaleY: 0 },
    visible: { 
      opacity: 1, 
      scaleY: 1,
      transition: {
        duration: 0.5,
        ease: easeOut
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Sales Trend - {period}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Sales Bars */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Sales Amount</span>
                <span className="text-sm text-muted-foreground font-medium">
                  Total: {formatCurrency(data.reduce((sum, item) => sum + item.sales, 0))}
                </span>
              </div>
              
              <motion.div 
                className="flex items-end justify-between gap-3 h-32"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex flex-col items-center flex-1 group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="relative w-full flex justify-center">
                      <motion.div
                        className="w-3/4 bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 group-hover:from-blue-400 group-hover:to-blue-500 shadow-lg"
                        style={{ 
                          height: `${(item.sales / maxSales) * 80}%`,
                          minHeight: '8px'
                        }}
                        whileHover={{
                          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                        }}
                      />
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                        {formatCurrency(item.sales)}
                      </div>
                    </div>
                    <span className="text-xs mt-3 font-medium text-muted-foreground">
                      {item.date}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Transactions Line */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Transactions</span>
                <span className="text-sm text-muted-foreground font-medium">
                  Total: {data.reduce((sum, item) => sum + item.transactions, 0)}
                </span>
              </div>
              
              <motion.div 
                className="flex items-end justify-between gap-3 h-20"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {data.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex flex-col items-center flex-1 group"
                  >
                    <div className="relative w-full flex justify-center">
                      <motion.div
                        className="w-2 bg-gradient-to-t from-emerald-500 to-emerald-600 rounded-t-full transition-all duration-300 group-hover:from-emerald-400 group-hover:to-emerald-500"
                        style={{ 
                          height: `${(item.transactions / maxTransactions) * 60}%`,
                          minHeight: '4px'
                        }}
                        whileHover={{
                          scaleY: 1.2,
                          boxShadow: "0 5px 15px -3px rgba(16, 185, 129, 0.4)"
                        }}
                      />
                      <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-foreground text-background px-2 py-1 rounded text-xs font-medium">
                        {item.transactions}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Legend */}
            <motion.div 
              className="flex gap-6 text-sm justify-center pt-4 border-t"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-600 rounded"></div>
                <span className="font-medium">Sales Amount</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-t from-emerald-500 to-emerald-600 rounded-full"></div>
                <span className="font-medium">Transactions</span>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}