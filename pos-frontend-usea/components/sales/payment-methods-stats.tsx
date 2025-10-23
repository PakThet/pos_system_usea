"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CreditCard, DollarSign, Smartphone, Wallet, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentMethodStats } from "@/types/sale";

interface PaymentMethodsStatsProps {
  stats: PaymentMethodStats[];
}

export function PaymentMethodsStats({ stats }: PaymentMethodsStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getIcon = (method: string) => {
    switch (method) {
      case 'cash': 
        return <DollarSign className="h-4 w-4" />;
      case 'card': 
        return <CreditCard className="h-4 w-4" />;
      case 'mobile': 
        return <Smartphone className="h-4 w-4" />;
      case 'credit': 
        return <Wallet className="h-4 w-4" />;
      default: 
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getColor = (method: string) => {
    switch (method) {
      case 'cash': return 'from-green-500 to-green-600';
      case 'card': return 'from-blue-500 to-blue-600';
      case 'mobile': return 'from-purple-500 to-purple-600';
      case 'credit': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
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
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20 h-full">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.method}
                variants={itemVariants}
                className="space-y-3 group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${getColor(stat.method)} text-white shadow-lg`}>
                      {getIcon(stat.method)}
                    </div>
                    <div>
                      <span className="font-semibold capitalize">{stat.method}</span>
                      <div className="text-xs text-muted-foreground">
                        {stat.count} transactions
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">{formatCurrency(stat.amount)}</div>
                    <div className="text-sm font-semibold text-primary">
                      {stat.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={stat.percentage} 
                    className="h-3 bg-muted/50 transition-all duration-500 group-hover:h-4"
                  />
                  <motion.div 
                    className={`absolute top-0 left-0 h-3 bg-gradient-to-r ${getColor(stat.method)} rounded-full transition-all duration-500 group-hover:h-4`}
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}