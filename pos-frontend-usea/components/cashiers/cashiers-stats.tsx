"use client";

import { CashierStats } from "@/types/cashier";
import { 
  Users, 
  UserCheck, 
  Coffee, 
  DollarSign,
  CreditCard,
  TrendingUp,
  Clock
} from "lucide-react";
import { StatsCard } from "./stats-card";
import { motion } from "framer-motion";

interface CashiersStatsProps {
  stats: CashierStats;
}

export function CashiersStats({ stats }: CashiersStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Cashiers",
      value: stats.total,
      description: "All cashiers",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950",
      delay: 0,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Active Now",
      value: stats.active,
      description: "Currently working",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950",
      delay: 0.1,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "On Break",
      value: stats.onBreak,
      description: "Taking breaks",
      icon: Coffee,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950",
      delay: 0.2
    },
    {
      title: "Total Sales",
      value: formatCurrency(stats.totalSales),
      description: "Today's sales",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950",
      delay: 0.3,
      trend: { value: 15, isPositive: true }
    },
    {
      title: "Transactions",
      value: stats.totalTransactions.toLocaleString(),
      description: "Today's transactions",
      icon: CreditCard,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950",
      delay: 0.4,
      trend: { value: 10, isPositive: true }
    },
    {
      title: "Avg Transaction",
      value: formatCurrency(stats.averageTransaction),
      description: "Average per transaction",
      icon: TrendingUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950",
      delay: 0.5
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {statCards.map((stat, index) => (
        <StatsCard key={stat.title} {...stat} delay={index * 0.1} />
      ))}
    </motion.div>
  );
}