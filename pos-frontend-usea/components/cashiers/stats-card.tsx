"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  delay?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  color, 
  bgColor,
  delay = 0,
  trend 
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="h-full"
    >
      <Card className="h-full border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-300 hover:shadow-lg bg-gradient-to-br from-background to-muted/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.p 
                className="text-2xl font-bold"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: delay + 0.2 }}
              >
                {value}
              </motion.p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{description}</p>
                {trend && (
                  <span className={`text-xs ${trend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
            </div>
            <motion.div 
              className={`p-3 rounded-xl ${bgColor} shadow-lg`}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Icon className={`h-6 w-6 ${color}`} />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}